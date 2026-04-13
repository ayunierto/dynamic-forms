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
  jsonTemplateSchema,
} from '@/schemas/dynamic-form.schema';
import { Save } from 'lucide-react';
import { NextPage } from 'next';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  name?: string;
}

const NewTemplate: NextPage<Props> = ({}) => {
  const form = useForm<JsonTemplate>({
    resolver: standardSchemaResolver(jsonTemplateSchema),
    defaultValues: {
      jsonTemplate: {
        title: '',
        description: '',
        sections: [],
      },
    },
  });

  const [sectionsJson, setSectionsJson] = React.useState(() =>
    JSON.stringify(form.getValues('jsonTemplate') ?? {}, null, 2),
  );

  function onSubmit(data: JsonTemplate) {
    console.log(data);
  }

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
                    <FieldLabel htmlFor="form-js">Json template</FieldLabel>
                    <JsonCodeEditor
                      value={sectionsJson}
                      onChange={(nextValue) => {
                        setSectionsJson(nextValue);

                        try {
                          const parsedValue: unknown = JSON.parse(nextValue);
                          const validation =
                            jsonTemplateSchema.shape.jsonTemplate.safeParse(
                              parsedValue,
                            );

                          if (validation.success) {
                            field.onChange(validation.data);
                          }
                        } catch {
                          // No actualizamos RHF hasta que el JSON sea válido
                        }
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      id="form-js"
                      aria-invalid={fieldState.invalid}
                      placeholder="Describe tus secciones..."
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
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
