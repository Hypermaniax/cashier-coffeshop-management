"use server";

import { authService } from "@/service/auth";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from "@/utils/validation/auth";
import { revalidatePath } from "next/cache";

export async function createEmployee(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validated = createEmployeeSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, message: validated.error.issues[0].message };
  }
  try {
    const { create } = await authService.createUser(validated.data);

    revalidatePath("/admin/employee");
    return {
      success: true,
      message: `Employee ${create.name} berhasil ditambahkan`,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateEmployee(id: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validated = updateEmployeeSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, message: validated.error.issues[0].message };
  }
  try {
    const { update } = await authService.updateUser(id, validated.data);
    revalidatePath("/admin/employee");
    return {
      success: true,
      message: `Employee ${update.name} berhasil diperbarui`,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteEmployee(id: string) {
  try {
    const { update } = await authService.sofDeleteUser(id);
    revalidatePath("/admin/employee");
    return {
      success: true,
      message: `Employee ${update.name} berhasil dihapus`,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
