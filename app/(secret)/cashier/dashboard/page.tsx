"use server";
import { productRepository } from "@/repositories/product";
import { categoryRepository } from "@/repositories/category";
import { PosContent } from "./pos-content";
import { cookies } from "next/headers";
import { validateToken } from "@/utils/jwt";
import { redirect } from "next/navigation";

export default async function CashierPosPage() {

  const [products, categories] = await Promise.all([
    productRepository.getProducts(),
    categoryRepository.getCategories(),
  ]);
  return <PosContent products={products} categories={categories} />;
}
