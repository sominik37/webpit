/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PADDLE_CLIENT_TOKEN: string;
  readonly VITE_PADDLE_SANDBOX_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
