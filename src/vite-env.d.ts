/// <reference types="vite/client" />

declare global {
  interface Window {
    electronAPI?: {
      platform: string;
      version: string;
      isElectron: boolean;
    };
  }
}

export {};