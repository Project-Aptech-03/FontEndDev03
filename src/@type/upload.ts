export interface UploadAvatarDto {
    avatar: File; // File object từ input type="file"
}

export interface UploadResponse {
    url: string;
}

export interface UploadError {
    message: string;
}
export interface UploadListImages {
    file: File[];
    folder: string;
}
export interface UploadListResponse {
    urls: string[];
}