import { useState, useEffect } from 'react';
import type { Template, TemplateVersion } from '../types';
import { getAdapter } from '../adapter-factory';

export function useTemplateEngine(templateId: string, version?: number) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [templateVersion, setTemplateVersion] =
    useState<TemplateVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const adapter = getAdapter();

    const versionPromise = version
      ? adapter.getVersion(templateId, version) // formulario histórico
      : adapter.getLatestVersion(templateId); // formulario nuevo

    Promise.all([adapter.getTemplate(templateId), versionPromise])
      .then(([tpl, ver]) => {
        setTemplate(tpl);
        setTemplateVersion(ver);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [templateId, version]);

  return { template, templateVersion, loading, error };
}
