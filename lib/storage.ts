import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { validateUpload, fileExtension } from "@/utils/upload";

const PUBLIC_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");

export const storageService = {
  async saveProductImage(file: File): Promise<string> {
    const check = await validateUpload(file);
    if (!check.ok) throw new Error(check.error);

    await fs.mkdir(PUBLIC_UPLOAD_DIR, { recursive: true });

    const fileName = `${randomUUID()}${fileExtension(file.type)}`;
    const filePath = path.join(PUBLIC_UPLOAD_DIR, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    return `/uploads/products/${fileName}`;
  },

  async deleteProductImage(imageUrl: string | null | undefined): Promise<void> {
    if (!imageUrl) return;
    const fileName = path.basename(imageUrl);
    if (!fileName || fileName.includes("..") || fileName.includes("/")) return;

    const filePath = path.join(PUBLIC_UPLOAD_DIR, fileName);
    try {
      await fs.unlink(filePath);
    } catch {
      // file mungkin sudah tidak ada
    }
  },
};
