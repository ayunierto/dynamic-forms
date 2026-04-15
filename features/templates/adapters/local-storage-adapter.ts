import type { ITemplateAdapter, Template, TemplateVersion } from '../types';
import { randomUUID } from 'crypto';

export class LocalStorageAdapter implements ITemplateAdapter {
  private templateKey(id: string) {
    return `template::${id}`;
  }

  private versionKey(templateId: string, version: number) {
    return `template::${templateId}::v${version}`;
  }

  // ── Template ──────────────────────────────────────────────

  async getTemplate(id: string): Promise<Template> {
    const raw = localStorage.getItem(this.templateKey(id));
    if (!raw) throw new Error(`Template ${id} no encontrado`);
    return JSON.parse(raw);
  }

  async saveTemplate(tpl: Template): Promise<Template> {
    localStorage.setItem(this.templateKey(tpl.id), JSON.stringify(tpl));
    return tpl;
  }

  // ── Versiones ─────────────────────────────────────────────

  async listVersions(templateId: string): Promise<TemplateVersion[]> {
    return Object.keys(localStorage)
      .filter((k) => k.startsWith(`template::${templateId}::v`))
      .map((k) => JSON.parse(localStorage.getItem(k)!))
      .sort((a, b) => a.version - b.version);
  }

  async getVersion(
    templateId: string,
    version: number,
  ): Promise<TemplateVersion> {
    const versions = await this.listVersions(templateId);
    const found = versions.find((v) => v.version === version);
    if (!found)
      throw new Error(
        `Versión ${version} no encontrada para template ${templateId}`,
      );
    return found;
  }

  async saveVersion(
    data: Omit<TemplateVersion, 'id' | 'version' | 'createdAt'>,
  ): Promise<TemplateVersion> {
    const versions = await this.listVersions(data.templateId);
    const nextVersion = versions.length
      ? Math.max(...versions.map((v) => v.version)) + 1
      : 1;

    const full: TemplateVersion = {
      ...data,
      id: randomUUID(),
      version: nextVersion,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      this.versionKey(data.templateId, nextVersion),
      JSON.stringify(full),
    );
    return full;
  }

  async deprecateVersion(templateId: string, version: number): Promise<void> {
    const key = this.versionKey(templateId, version);
    const raw = localStorage.getItem(key);
    if (!raw) throw new Error(`Versión ${version} no encontrada`);
    const tplVersion: TemplateVersion = JSON.parse(raw);
    localStorage.setItem(
      key,
      JSON.stringify({ ...tplVersion, deprecated: true }),
    );
  }

  async getLatestVersion(templateId: string): Promise<TemplateVersion> {
    const versions = await this.listVersions(templateId);
    const latest = versions.filter((v) => !v.deprecated).at(-1);
    if (!latest)
      throw new Error(`No hay versiones activas para template ${templateId}`);
    return latest;
  }
}
