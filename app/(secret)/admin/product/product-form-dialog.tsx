"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ChevronLeft } from "lucide-react";
import { createProduct, updateProduct, createCategory } from "./actions";

type Category = { id: number; name: string };

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string | null;
  categoryId: number;
};

interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  product?: Product;
}

export function ProductFormDialog({
  open,
  onClose,
  categories,
  product,
}: ProductFormDialogProps) {
  const isEdit = !!product;
  const formRef = useRef<HTMLFormElement>(null);

  const [categoryId, setCategoryId] = useState(
    product?.categoryId?.toString() ?? ""
  );
  const [categoryMode, setCategoryMode] = useState<"select" | "new">("select");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, startCreatingCategory] = useTransition();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [localCategories, setLocalCategories] = useState<Category[]>(categories);

  function handleClose() {
    setError(null);
    setCategoryMode("select");
    setNewCategoryName("");
    setCategoryId(product?.categoryId?.toString() ?? "");
    onClose();
  }

  function handleCreateCategory() {
    if (!newCategoryName.trim()) return;
    startCreatingCategory(async () => {
      try {
        const cat = await createCategory(newCategoryName);
        setLocalCategories((prev) =>
          prev.find((c) => c.id === cat.id) ? prev : [...prev, cat]
        );
        setCategoryId(cat.id.toString());
        setCategoryMode("select");
        setNewCategoryName("");
      } catch {
        setError("Failed to create category.");
      }
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("categoryId", categoryId);

    startTransition(async () => {
      try {
        if (isEdit) {
          await updateProduct(product.id, formData);
        } else {
          await createProduct(formData);
        }
        formRef.current?.reset();
        setCategoryId("");
        setCategoryMode("select");
        handleClose();
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Americano"
              defaultValue={product?.name}
              required
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price (Rp)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min={0}
                step="any"
                placeholder="25000"
                defaultValue={product?.price}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min={0}
                placeholder="50"
                defaultValue={product?.stock}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Category</Label>
              {categoryMode === "select" ? (
                <button
                  type="button"
                  onClick={() => setCategoryMode("new")}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Plus className="h-3 w-3" />
                  New category
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setCategoryMode("select");
                    setNewCategoryName("");
                  }}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:underline"
                >
                  <ChevronLeft className="h-3 w-3" />
                  Pick existing
                </button>
              )}
            </div>

            {categoryMode === "select" ? (
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {localCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Cold Drinks"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateCategory();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  disabled={creatingCategory || !newCategoryName.trim()}
                  onClick={handleCreateCategory}
                >
                  {creatingCategory ? "..." : "Add"}
                </Button>
              </div>
            )}
          </div>

          {/* Image */}
          <div className="space-y-1.5">
            <Label htmlFor="image">Image URL (optional)</Label>
            <Input
              id="image"
              name="image"
              placeholder="https://..."
              defaultValue={product?.image ?? ""}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !categoryId}>
              {isPending
                ? "Saving..."
                : isEdit
                ? "Save Changes"
                : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
