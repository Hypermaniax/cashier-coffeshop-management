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
import { deleteEmployee } from "./action";
import { toast } from "sonner";

interface DeleteEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  employee: { id: string; name: string } | null;
}

export function DeleteEmployeeDialog({
  open,
  onClose,
  employee,
}: DeleteEmployeeDialogProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!employee) return;
    startTransition(async () => {
      const result = await deleteEmployee(employee.id);
      if (result?.success) {
        toast.success(result.message ?? "Karyawan berhasil dihapus");
      } else {
        toast.error(result?.message ?? "Gagal menghapus karyawan");
      }
      onClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !isPending && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Hapus Karyawan</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus karyawan{" "}
            <span className="font-semibold text-foreground">
              {employee?.name}
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
