/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    // thêm các biến khác nếu có
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
