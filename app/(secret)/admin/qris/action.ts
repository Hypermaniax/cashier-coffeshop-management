"use server";

import { requireAuth } from "@/lib/auth";
import { qrisService } from "@/lib/qris";

export async function uploadQris(formData: FormData) {
  const session = await requireAuth("ADMIN");

  const file = formData.get("qris") as File | null;
  if (!file || file.size === 0) {
    return { success: false, message: "Pilih file gambar QRIS terlebih dahulu" };
  }

  try {
    await qrisService.saveQrisImage(file, session.id);
    return { success: true, message: "QRIS berhasil diperbarui" };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
