"use server";

import prisma from "@/lib/client";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const categoryId = parseInt(formData.get("categoryId") as string);
  const image = (formData.get("image") as string) || null;

  if (!name || isNaN(price) || isNaN(stock) || isNaN(categoryId)) {
    throw new Error("Invalid form data");
  }

  await prisma.product.create({
    data: { name, price, stock, categoryId, image },
  });

  revalidatePath("/admin/product");
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const categoryId = parseInt(formData.get("categoryId") as string);
  const image = (formData.get("image") as string) || null;

  if (!name || isNaN(price) || isNaN(stock) || isNaN(categoryId)) {
    throw new Error("Invalid form data");
  }

  await prisma.product.update({
    where: { id },
    data: { name, price, stock, categoryId, image },
  });

  revalidatePath("/admin/product");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/product");
}

export async function createCategory(name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Category name is required");

  const existing = await prisma.category.findFirst({
    where: { name: { equals: trimmed, mode: "insensitive" } },
  });
  if (existing) return existing;

  const category = await prisma.category.create({ data: { name: trimmed } });
  revalidatePath("/admin/product");
  return category;
}
