import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteEmployee } from "./action";

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
      await deleteEmployee(employee.id);
      onClose();
    });
  }
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Employee</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {employee?.name}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
