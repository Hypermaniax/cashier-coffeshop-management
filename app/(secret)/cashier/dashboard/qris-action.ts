"use server";

import { requireAuth } from "@/lib/auth";
import { qrisService } from "@/lib/qris";

export async function getQrisDataUrl(): Promise<{
  ok: boolean;
  dataUrl?: string;
  error?: string;
}> {
  try {
    await requireAuth();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  try {
    const buffer = await qrisService.readQrisImage();
    const base64 = buffer.toString("base64");
    return { ok: true, dataUrl: `data:image/png;base64,${base64}` };
  } catch (err: any) {
    if (err.message?.includes("INTEGRITAS")) {
      console.error("[SECURITY] QRIS tamper detected:", err.message);
      return { ok: false, error: "INTEGRITAS QRIS GAGAL: file dimodifikasi" };
    }
    return { ok: false, error: "QRIS belum tersedia. Hubungi admin." };
  }
}
