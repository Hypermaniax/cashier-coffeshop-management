"use server";

import { ProductTable } from "./product-table";
import { productRepository } from "@/repositories/product";
import { categoryRepository } from "@/repositories/category";
import { modifierRepository } from "@/repositories/modifier";

export default async function ProductPage() {
  const [products, categories, modifierGroups] = await Promise.all([
    productRepository.getProducts(),
    categoryRepository.getCategories(),
    modifierRepository.getModifierGroups(),
  ]);
  return (
    <div className="p-6">
      <ProductTable
        products={products}
        categories={categories}
        modifierGroups={modifierGroups}
      />
    </div>
  );
}
