/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_NAME: string
    readonly VITE_VERSION: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}