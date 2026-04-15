import { ITemplateAdapter, Template, TemplateVersion } from '../types';

export class ApiAdapter implements ITemplateAdapter {
  private base = process.env.NEXT_PUBLIC_API_URL!;

  // ── Template ──────────────────────────────────────────────

  async getTemplate(id: string): Promise<Template> {
    const res = await fetch(`${this.base}/templates/${id}`);
    if (!res.ok) throw new Error(`Template ${id} no encontrado`);
    return res.json();
  }

  async saveTemplate(tpl: Template): Promise<Template> {
    const res = await fetch(`${this.base}/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tpl),
    });
    return res.json();
  }

  // ── Versiones ─────────────────────────────────────────────

  async listVersions(templateId: string): Promise<TemplateVersion[]> {
    const res = await fetch(`${this.base}/templates/${templateId}/versions`);
    return res.json();
  }

  async getVersion(
    templateId: string,
    version?: number,
  ): Promise<TemplateVersion> {
    const url = version
      ? `${this.base}/templates/${templateId}/versions/${version}`
      : `${this.base}/templates/${templateId}/versions/latest`;
    const res = await fetch(url);
    if (!res.ok)
      throw new Error(`Versión no encontrada para template ${templateId}`);
    return res.json();
  }

  async saveVersion(
    data: Omit<TemplateVersion, 'id' | 'version' | 'createdAt'>,
  ): Promise<TemplateVersion> {
    const res = await fetch(
      `${this.base}/templates/${data.templateId}/versions`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
    );
    return res.json();
  }

  async deprecateVersion(templateId: string, version: number): Promise<void> {
    await fetch(
      `${this.base}/templates/${templateId}/versions/${version}/deprecate`,
      {
        method: 'PATCH',
      },
    );
  }

  async getLatestVersion(templateId: string): Promise<TemplateVersion> {
    const res = await fetch(
      `${this.base}/templates/${templateId}/versions/latest`,
    );
    if (!res.ok)
      throw new Error(`No hay versiones activas para template ${templateId}`);
    return res.json();
  }
}
