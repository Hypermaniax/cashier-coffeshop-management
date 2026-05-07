"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ChevronLeft, Loader2, Check, X } from "lucide-react";
import { createProduct, updateProduct, createCategory } from "./actions";
import { toast } from "sonner";
import { Category, ProductFormDialogProps } from "@/types";
import { cn } from "@/lib/utils";

export function ProductFormDialog({
  open,
  onClose,
  categories,
  modifierGroups,
  product,
}: ProductFormDialogProps) {
  const isEdit = !!product;
  const formRef = useRef<HTMLFormElement>(null);

  const [categoryId, setCategoryId] = useState(
    product?.categoryId?.toString() ?? "",
  );
  const [categoryMode, setCategoryMode] = useState<"select" | "new">("select");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, startCreatingCategory] = useTransition();
  const [isPending, startTransition] = useTransition();
  const [localCategories, setLocalCategories] =
    useState<Category[]>(categories);

  const [selectedModifiers, setSelectedModifiers] = useState<string[]>(
    product?.modifierGroups?.map((mg) => mg.id) ?? [],
  );

  function handleClose() {
    setCategoryMode("select");
    setNewCategoryName("");
    setCategoryId(product?.categoryId?.toString() ?? "");
    setSelectedModifiers(product?.modifierGroups?.map((mg) => mg.id) ?? []);
    onClose();
  }

  function toggleModifier(id: string) {
    setSelectedModifiers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  }

  function handleCreateCategory() {
    if (!newCategoryName.trim()) return;
    startCreatingCategory(async () => {
      try {
        const { message, success, data } =
          await createCategory(newCategoryName);
        if (success) {
          toast.success(message);
          setLocalCategories((prev) =>
            prev.find((c) => c.id === data?.id) ? prev : [...prev, data!],
          );
          setCategoryId(data?.id.toString() ?? "");
          setCategoryMode("select");
          setNewCategoryName("");
        } else {
          toast.error(message);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("categoryId", categoryId);
    formData.set("modifierGroupIds", JSON.stringify(selectedModifiers));

    startTransition(async () => {
      try {
        const action = isEdit
          ? updateProduct(product.id, formData)
          : createProduct(formData);
        const { success, message } = await action;
        if (success) {
          toast.success(message);
          formRef.current?.reset();
          handleClose();
        } else {
          toast.error(message);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !isPending && handleClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Produk" : "Tambah Produk"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Perbarui data produk dan modifier yang terpasang."
              : "Isi data produk baru beserta modifier yang ingin ditambahkan."}
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="prod-name">Nama Produk</Label>
            <Input
              id="prod-name"
              name="name"
              placeholder="Contoh: Americano"
              defaultValue={product?.name}
              disabled={isPending}
              required
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="prod-price">Harga (Rp)</Label>
              <Input
                id="prod-price"
                name="price"
                type="number"
                min={0}
                step="any"
                placeholder="25000"
                defaultValue={product?.price}
                onFocus={(e) => e.target.select()}
                disabled={isPending}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prod-stock">Stok</Label>
              <Input
                id="prod-stock"
                name="stock"
                type="number"
                min={0}
                placeholder="50"
                defaultValue={product?.stock}
                onFocus={(e) => e.target.select()}
                disabled={isPending}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Kategori</Label>
              {categoryMode === "select" ? (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setCategoryMode("new")}
                  className="flex h-auto p-0 items-center gap-1 text-xs text-amber-600 hover:text-amber-700"
                >
                  <Plus className="h-3 w-3" /> Kategori baru
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    setCategoryMode("select");
                    setNewCategoryName("");
                  }}
                  className="flex h-auto p-0 items-center gap-1 text-xs text-muted-foreground"
                >
                  <ChevronLeft className="h-3 w-3" /> Pilih yang ada
                </Button>
              )}
            </div>

            {categoryMode === "select" ? (
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
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
                  placeholder="Contoh: Cold Drinks"
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
                  className="shrink-0"
                >
                  {creatingCategory ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Tambah"
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label>Modifier</Label>
              {selectedModifiers.length > 0 && (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setSelectedModifiers([])}
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-red-500 flex items-center gap-1"
                >
                  <X className="h-3 w-3" /> Hapus semua
                </Button>
              )}
            </div>

            {modifierGroups.length === 0 ? (
              <p className="rounded-lg border border-dashed py-4 text-center text-xs text-muted-foreground">
                Belum ada modifier. Tambahkan di halaman Modifier terlebih
                dahulu.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {modifierGroups.map((mg) => {
                  const isSelected = selectedModifiers.includes(mg.id);
                  return (
                    <Button
                      key={mg.id}
                      type="button"
                      variant="outline"
                      onClick={() => toggleModifier(mg.id)}
                      className={cn(
                        "flex h-8 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
                        isSelected
                          ? "border-amber-400 bg-amber-50 text-amber-700 shadow-sm hover:bg-amber-100 hover:text-amber-800"
                          : "border-gray-200 bg-background text-muted-foreground hover:border-amber-300 hover:text-amber-600 hover:bg-background",
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      {mg.name}
                    </Button>
                  );
                })}
              </div>
            )}

            {selectedModifiers.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedModifiers.length} modifier dipilih
              </p>
            )}
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="prod-image">Gambar Produk (Opsional)</Label>
            
            {/* Tampilkan gambar yang sudah ada jika ada */}
            {isEdit && product?.image && typeof product.image === "string" && (
              <div className="mb-2 flex flex-col items-center gap-3">
                <img 
                  src={product.image} 
                  alt="Preview" 
                  className="w-full object-cover rounded-md border"
                />
                <p className="text-xs text-muted-foreground">Gambar saat ini</p>
              </div>
            )}
            
            <Input
              id="prod-image"
              name="image"
              disabled={isPending}
              type="file"
              accept="image/png, image/jpeg, image/webp"
            />
            {isEdit && (
              <p className="text-[11px] text-muted-foreground">
                *Biarkan kosong jika tidak ingin mengubah gambar.
              </p>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2 pb-1">
            <Checkbox
              id="prod-isActive"
              name="isActive"
              defaultChecked={isEdit ? product.isActive : true}
              className="border-gray-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 focus-visible:ring-amber-500"
            />
            <Label htmlFor="prod-isActive" className="cursor-pointer">
              Produk Aktif
            </Label>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending || !categoryId}
              className="bg-amber-500 hover:bg-amber-600 min-w-[120px]"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEdit ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Produk"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
