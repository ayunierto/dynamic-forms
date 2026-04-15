import { JsonTemplate } from '@/features/templates/schemas/dynamic-form.schema';

export type Template = {
  id: string;
  name: string;
  description: string;
};

export type TemplateVersion = {
  id: string;
  templateId: string;
  version: number;
  schema: JsonTemplate;
  createdAt: string; // ISO 8601 string
  deprecated: boolean; // ← formularios nuevos no pueden usar esta versión
  changelog?: string; // ← opcional pero útil para el equipo
};

export interface ITemplateAdapter {
  // Template
  getTemplate(id: string): Promise<Template>;
  saveTemplate(template: Template): Promise<Template>;

  // Versiones
  getLatestVersion(templateId: string): Promise<TemplateVersion>;
  getVersion(templateId: string, version?: number): Promise<TemplateVersion>;
  saveVersion(
    data: Omit<TemplateVersion, 'id' | 'version' | 'createdAt'>,
  ): Promise<TemplateVersion>;
  listVersions(templateId: string): Promise<TemplateVersion[]>;
  deprecateVersion(templateId: string, version: number): Promise<void>;
}
