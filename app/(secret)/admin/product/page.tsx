import prisma from "@/lib/client";
import { ProductTable } from "./product-table";

export default async function ProductPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="p-6">
      <ProductTable products={products} categories={categories} />
    </div>
  );
}