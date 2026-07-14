/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SEGMENT_WRITE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
