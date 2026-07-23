import { Readable } from "node:stream";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const MAX_FILE_SIZE =
  (Number(process.env.UPLOAD_MAX_SIZE_MB) || 5) * 1024 * 1024;

const MAGIC_BYTES: Record<string, number[]> = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/webp": [0x52, 0x49, 0x46, 0x46],
};

export interface UploadValidationResult {
  ok: boolean;
  error?: string;
}

export async function validateUpload(
  file: File,
  opts: { maxSize?: number; allowedTypes?: readonly string[] } = {},
): Promise<UploadValidationResult> {
  const maxSize = opts.maxSize ?? MAX_FILE_SIZE;
  const allowedTypes = opts.allowedTypes ?? ALLOWED_IMAGE_TYPES;

  if (!allowedTypes.includes(file.type)) {
    return {
      ok: false,
      error: `Tipe file tidak diizinkan. Hanya: ${allowedTypes.join(", ")}`,
    };
  }

  if (file.size > maxSize) {
    return {
      ok: false,
      error: `Ukuran file maksimal ${Math.round(maxSize / (1024 * 1024))}MB`,
    };
  }

  const head = await readHeadBytes(file, MAGIC_BYTES[file.type]?.length ?? 4);
  const expected = MAGIC_BYTES[file.type];
  if (expected && !expected.every((b, i) => head[i] === b)) {
    return { ok: false, error: "Konten file tidak sesuai dengan tipe yang diklaim" };
  }

  return { ok: true };
}

async function readHeadBytes(file: File, length: number): Promise<number[]> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf.slice(0, length));
  return Array.from(bytes);
}

export function fileExtension(type: string): string {
  switch (type) {
    case "image/jpeg":
    case "image/jpg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    default:
      return "";
  }
}

export { Readable };
