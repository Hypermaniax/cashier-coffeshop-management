"use server";

import { ProductTable } from "./product-table";
import { productRepository } from "@/repositories/product";
import { categoryRepository } from "@/repositories/category";

export default async function ProductPage() {
  const [products, categories] = await Promise.all([
    productRepository.getProducts(),
    categoryRepository.getCategories(),
  ]);
  return (
    <div className="p-6">
      <ProductTable products={products} categories={categories} />
    </div>
  );
}
