/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_SERVER_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
