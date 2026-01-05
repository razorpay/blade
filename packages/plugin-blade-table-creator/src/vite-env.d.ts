/// <reference types="vite/client" />
/// <reference types="@figma/plugin-typings" />

interface ImportMetaEnv {
  readonly VITE_AMPLITUDE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
