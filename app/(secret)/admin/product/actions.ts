"use server";

import { categoryService } from "@/service/category";
import { productService } from "@/service/product";
import { productRepository } from "@/repositories/product";
import { createCategorySchema } from "@/utils/validation/categories";
import {
  createProductSchema,
  updateProductSchema,
} from "@/utils/validation/product";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const validate = createProductSchema.safeParse(data);
  if (!validate.success)
    return {
      success: false,
      message: validate.error.issues[0].message,
      inputs: validate.data,
    };
  try {
    const { create, category } = await productService.createProduct(
      validate.data,
    );

    revalidatePath("/admin/product");
    return {
      success: true,
      message: `Produk ${create.name} (${category.name}) berhasil ditambahkan`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      inputs: validate.data,
    };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validate = updateProductSchema.safeParse(data);
  if (!validate.success) {
    return {
      success: false,
      message: validate.error.issues[0].message,
      inputs: validate.data,
    };
  }
  try {
    const { update } = await productService.updateProduct(id, validate.data);
    revalidatePath("/admin/product");

    return {
      success: true,
      message: `Produk ${update.name} berhasil diperbarui`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      inputs: validate.data,
    };
  }
}

export async function deleteProduct(id: string) {
  try {
    const { update } = await productService.softDeleteProduct(id);
    revalidatePath("/admin/product");
    return {
      success: true,
      message: `Product ${update.name} deleted successfully`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function createCategory(name: string) {
  const validate = createCategorySchema.safeParse({ name });
  if (!validate.success)
    return {
      success: false,
      message: validate.error.issues[0].message,
      inputs: validate.data,
    };

  try {
    const create = await categoryService.createCategory(
      validate.data.name.toLowerCase(),
    );
    revalidatePath("admin/product");
    return {
      success: true,
      message: `Category ${create.name} created successfully`,
      data: create,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      inputs: validate.data,
    };
  }
}
