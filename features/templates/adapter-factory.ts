import type { ITemplateAdapter } from './types';

let instance: ITemplateAdapter | null = null;

export function getAdapter(): ITemplateAdapter {
  if (instance) return instance;

  if (process.env.NODE_ENV === 'production') {
    const { ApiAdapter } = require('./adapters/api-adapter');
    instance = new ApiAdapter();
  } else {
    const { LocalStorageAdapter } = require('./adapters/local-storage-adapter');
    instance = new LocalStorageAdapter();
  }

  return instance!;
}
