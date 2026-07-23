"use server";

import { modifierRepository } from "@/repositories/modifier";
import { CreateModifierGroupDto, UpdateModifierGroupDto } from "@/types";
import { revalidatePath } from "next/cache";
import { createModifierGroupSchema, updateModifierGroupSchema } from "@/utils/validation/modifier";
import { requireAuth } from "@/lib/auth";

export async function createModifierGroupAction(data: CreateModifierGroupDto) {
  await requireAuth("ADMIN");
  try {
    const validate = createModifierGroupSchema.safeParse(data);
    if (!validate.success) {
      return { 
        success: false, 
        message: validate.error.issues[0].message,
        inputs: data 
      };
    }

    await modifierRepository.createModifierGroup(validate.data);
    revalidatePath("/admin/modifiers");
    return { success: true, message: "Modifier berhasil ditambahkan" };
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal menambah modifier" };
  }
}

export async function updateModifierGroupAction(id: string, data: UpdateModifierGroupDto) {
  await requireAuth("ADMIN");
  try {
    const validate = updateModifierGroupSchema.safeParse(data);
    if (!validate.success) {
      return { 
        success: false, 
        message: validate.error.issues[0].message,
        inputs: data 
      };
    }

    await modifierRepository.updateModifierGroup(id, validate.data);
    revalidatePath("/admin/modifiers");
    return { success: true, message: "Modifier berhasil diupdate" };
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal mengupdate modifier" };
  }
}

export async function deleteModifierGroupAction(id: string) {
  await requireAuth("ADMIN");
  try {
    await modifierRepository.deleteModifierGroup(id);
    revalidatePath("/admin/modifiers");
    return { success: true, message: "Modifier berhasil dihapus" };
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal menghapus modifier" };
  }
}
