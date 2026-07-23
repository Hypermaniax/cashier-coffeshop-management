import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import prisma from "@/lib/client";
import { validateUpload } from "@/utils/upload";

const QRIS_DIR = path.join(process.cwd(), "storage", "private", "qris");
const QRIS_FILE = "qris.png";

function sha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

export const qrisService = {
  async saveQrisImage(file: File, adminId: string): Promise<void> {
    const check = await validateUpload(file);
    if (!check.ok) throw new Error(check.error);

    await fs.mkdir(QRIS_DIR, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const hash = sha256(buffer);
    const filePath = path.join(QRIS_DIR, QRIS_FILE);

    await fs.writeFile(filePath, buffer, { mode: 0o444 });
    await fs.chmod(filePath, 0o444);

    await prisma.qrisConfig.upsert({
      where: { id: "active" },
      create: {
        id: "active",
        hash,
        filePath,
        uploadedById: adminId,
        createdAt: new Date(),
      },
      update: {
        hash,
        filePath,
        uploadedById: adminId,
        createdAt: new Date(),
      },
    });
  },

  async readQrisImage(): Promise<Buffer> {
    const config = await prisma.qrisConfig.findUnique({ where: { id: "active" } });
    if (!config) throw new Error("QRIS belum diunggah");

    const filePath = path.resolve(config.filePath);
    if (path.dirname(filePath) !== QRIS_DIR) {
      throw new Error("Path QRIS tidak valid");
    }

    let buffer: Buffer;
    try {
      buffer = await fs.readFile(filePath);
    } catch {
      throw new Error("File QRIS tidak ditemukan di server");
    }

    const currentHash = sha256(buffer);
    if (currentHash !== config.hash) {
      throw new Error("INTEGRITAS QRIS GAGAL: file telah dimodifikasi");
    }

    return buffer;
  },

  async getQrisMeta() {
    return prisma.qrisConfig.findUnique({ where: { id: "active" } });
  },
};
