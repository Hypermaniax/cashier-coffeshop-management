"use client";

import { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteModifierGroupAction } from "./actions";

interface DeleteModifierDialogProps {
  open: boolean;
  onClose: () => void;
  modifierId: string | null;
  modifierName: string;
}

export function DeleteModifierDialog({
  open,
  onClose,
  modifierId,
  modifierName,
}: DeleteModifierDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!modifierId) return;

    startTransition(async () => {
      const result = await deleteModifierGroupAction(modifierId);
      if (result.success) {
        toast.success(result.message);
        onClose();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hapus Modifier</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus modifier{" "}
            <span className="font-semibold text-foreground">{modifierName}</span>?
            Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
