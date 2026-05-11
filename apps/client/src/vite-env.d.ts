/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** YouTube Data API v3 키 */
  readonly VITE_YOUTUBE_API_KEY: string;
  /** 백엔드 API Base URL */
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
