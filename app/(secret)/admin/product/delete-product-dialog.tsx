"use client";

import { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { deleteProduct } from "./actions";
import { toast } from "sonner";

interface DeleteProductDialogProps {
  open: boolean;
  onClose: () => void;
  product: { id: string; name: string } | null;
}

export function DeleteProductDialog({
  open,
  onClose,
  product,
}: DeleteProductDialogProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!product) return;
    startTransition(async () => {
      const result = await deleteProduct(product.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      onClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !isPending && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Hapus Produk</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus produk{" "}
            <span className="font-semibold text-foreground">
              {product?.name}
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="min-w-[90px]"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
