'use client';

import React from 'react';
import {
  PageContainer,
  PageContainerDescription,
  PageContainerHeader,
  PageContainerLeftContent,
  PageContainerRightContent,
  PageContainerTitle,
} from '@/components/dashboard/page-container';
import { SiteHeader } from '@/components/dashboard/site-header';
import { JsonCodeEditor } from '@/components/editor';
import { Button } from '@/components/ui/button';
import {
  JsonTemplate,
  templateSchema,
  jsonTemplateSchema,
} from '@/features/templates/schemas/dynamic-form.schema';
import { Save } from 'lucide-react';
import { NextPage } from 'next';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldLabel } from '@/components/ui/field';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  name?: string;
}

const NewTemplate: NextPage<Props> = ({}) => {
  const form = useForm<JsonTemplate>({
    resolver: standardSchemaResolver(jsonTemplateSchema),
    mode: 'onChange',
    defaultValues: {
      jsonTemplate: {
        title: '',
        description: '',
        sections: [],
      },
    },
  });

  const [templateJson, setTemplateJson] = React.useState<string>(() =>
    JSON.stringify(form.getValues('jsonTemplate') ?? {}, null, 4),
  );
  const [editorError, setEditorError] = React.useState<string | null>(null);

  function onSubmit(data: JsonTemplate) {
    console.log(data);
  }

  const setTemplateError = (message: string) => {
    setEditorError(message);
    form.setError('jsonTemplate', {
      type: 'manual',
      message,
    });
  };

  const clearTemplateError = () => {
    setEditorError(null);
    form.clearErrors('jsonTemplate');
  };

  return (
    <>
      <SiteHeader title="Nueva Plantilla" />

      <PageContainer>
        <PageContainerHeader>
          <PageContainerLeftContent>
            <PageContainerTitle>Nueva Plantilla</PageContainerTitle>
            <PageContainerDescription>
              Crea una nueva plantilla para tus formularios.
            </PageContainerDescription>
          </PageContainerLeftContent>

          <PageContainerRightContent>
            <Button type="submit" form="json-template-form">
              <Save /> Guardar
            </Button>
          </PageContainerRightContent>
        </PageContainerHeader>

        <Card>
          <CardContent>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              id="json-template-form"
              className="flex flex-col gap-4"
            >
              <Controller
                name="jsonTemplate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-json">Json template</FieldLabel>

                    <JsonCodeEditor
                      value={templateJson}
                      onChange={(nextValue) => {
                        setTemplateJson(nextValue);

                        try {
                          const parsedValue: unknown = JSON.parse(nextValue);
                          // Sincronizamos RHF con el último JSON parseable para evitar estado obsoleto.
                          field.onChange(parsedValue as JsonTemplate);
                          const validation =
                            templateSchema.safeParse(parsedValue);

                          if (validation.success) {
                            clearTemplateError();
                            return;
                          }

                          const firstIssue = validation.error.issues[0];
                          const issuePath = firstIssue.path.join('.');
                          const issuePrefix = issuePath ? `${issuePath}: ` : '';
                          setTemplateError(
                            `${issuePrefix}${firstIssue.message}`,
                          );
                        } catch (error) {
                          console.log(error);
                          if (error instanceof Error)
                            setTemplateError(error.message);

                          // Si no es JSON válido, invalidamos el valor del campo para no conservar el último valor correcto.
                          field.onChange(undefined);
                          setTemplateError(
                            `${error instanceof Error ? error.message : 'Error desconocido'}`,
                          );
                        }
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      id="form-json"
                      aria-invalid={fieldState.invalid}
                    />

                    {editorError && (
                      <div className="mt-2" role="alert">
                        <pre className="text-blue-700 text-base font-bold">
                          Errores de sintaxis:
                        </pre>
                        <pre className="text-sm text-yellow-500" role="alert">
                          {editorError}
                        </pre>
                      </div>
                    )}

                    {/* Mostrar mensajes de error: puede venir anidado como objeto */}
                    {(() => {
                      const err =
                        fieldState.error ?? form.formState.errors.jsonTemplate;
                      if (!err) return null;

                      const collectMessages = (
                        e: string | { message?: string },
                      ): string[] => {
                        if (!e) return [];
                        if (typeof e === 'string') return [e];
                        if (typeof e.message === 'string' && e.message)
                          return [e.message];
                        if (typeof e === 'object') {
                          return Object.values(e).flatMap((v) =>
                            collectMessages(v),
                          );
                        }
                        return [];
                      };

                      const messages = collectMessages(err);
                      if (messages.length === 0) return null;

                      return (
                        <>
                          <p className="text-base">Errores de validación:</p>
                          <ul className="list-disc pl-6">
                            {messages.map((msg, index) => (
                              <li key={index}>{msg}</li>
                            ))}
                          </ul>
                        </>
                      );
                    })()}

                    {fieldState.error && (
                      <pre className="text-muted-foreground">
                        {JSON.stringify(fieldState.error, null, 2)}
                      </pre>
                    )}
                  </Field>
                )}
              />
            </form>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
};

export default NewTemplate;
