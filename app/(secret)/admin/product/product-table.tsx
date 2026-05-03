"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Package } from "lucide-react";
import { ProductFormDialog } from "./product-form-dialog";
import { DeleteProductDialog } from "./delete-product-dialog";
import { cn } from "@/lib/utils";
import { ModifierGroup } from "@/types";

type Category = { id: number; name: string };

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string | null;
  isActive: boolean;
  categoryId: number;
  category: Category;
  modifierGroups?: { id: string; name: string }[];
};

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  modifierGroups: ModifierGroup[];
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function ProductTable({ products, categories, modifierGroups }: ProductTableProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  function openAdd() {
    setEditProduct(undefined);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditProduct(product);
    setFormOpen(true);
  }

  function handleFormClose() {
    setFormOpen(false);
    setEditProduct(undefined);
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6 text-amber-500" />
            Products
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola produk dan modifier untuk coffee shop Anda.
          </p>
        </div>
        <Button
          id="btn-tambah-product"
          onClick={openAdd}
          className="bg-amber-500 hover:bg-amber-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-12 font-semibold">No</TableHead>
              <TableHead className="font-semibold">Nama</TableHead>
              <TableHead className="font-semibold">Kategori</TableHead>
              <TableHead className="font-semibold">Harga</TableHead>
              <TableHead className="font-semibold">Stok</TableHead>
              <TableHead className="font-semibold">Modifier</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-center w-28 font-semibold">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Package className="h-8 w-8 opacity-30" />
                    <p className="font-medium">Belum ada produk</p>
                    <p className="text-xs">Klik &quot;Tambah Produk&quot; untuk memulai.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow key={product.id} className="group">
                  <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {product.category.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatRupiah(product.price)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "font-medium",
                        product.stock <= 5 && "text-red-500"
                      )}
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    {product.modifierGroups && product.modifierGroups.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {product.modifierGroups.slice(0, 2).map((mg) => (
                          <Badge key={mg.id} variant="outline" className="text-[10px] border-amber-200 bg-amber-50 text-amber-700">
                            {mg.name}
                          </Badge>
                        ))}
                        {product.modifierGroups.length > 2 && (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">
                            +{product.modifierGroups.length - 2}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-semibold",
                        product.isActive
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-red-200 bg-red-50 text-red-600"
                      )}
                    >
                      {product.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        id={`btn-edit-product-${product.id}`}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-amber-50"
                        onClick={() => openEdit(product)}
                      >
                        <Pencil className="h-3.5 w-3.5 text-amber-600" />
                      </Button>
                      <Button
                        id={`btn-delete-product-${product.id}`}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-red-50"
                        onClick={() => setDeleteTarget({ id: product.id, name: product.name })}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <ProductFormDialog
        open={formOpen}
        onClose={handleFormClose}
        categories={categories}
        modifierGroups={modifierGroups}
        product={editProduct}
      />
      <DeleteProductDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        product={deleteTarget}
      />
    </>
  );
}
