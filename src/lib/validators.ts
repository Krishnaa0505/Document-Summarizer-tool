export const MAX_FILE_SIZE_BYTES = 4.5 * 1024 * 1024; // 4.5 MB - Vercel Serverless payload limit
export const MAX_FILE_SIZE_MB = 4.5;

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

export const ALLOWED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".webp"];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(file: { name: string; size: number; type: string }): ValidationResult {
  if (!file || !file.name) {
    return { valid: false, error: "No file selected." };
  }

  if (file.size === 0) {
    return { valid: false, error: "The uploaded file is empty." };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the limit of ${MAX_FILE_SIZE_MB} MB. Please upload a smaller file.`,
    };
  }

  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  const hasValidExt = ALLOWED_EXTENSIONS.includes(ext);
  const hasValidMime = file.type ? ALLOWED_MIME_TYPES.includes(file.type.toLowerCase()) : false;

  if (!hasValidExt && !hasValidMime) {
    return {
      valid: false,
      error: "Unsupported file type. Please upload a PDF, PNG, JPG, JPEG, or WEBP document.",
    };
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
