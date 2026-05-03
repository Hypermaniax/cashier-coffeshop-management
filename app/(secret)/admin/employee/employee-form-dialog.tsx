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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { createEmployee, updateEmployee } from "./action";
import { toast } from "sonner";
import { EmployeeFormDialogProps } from "@/types";

export default function EmployeeFormDialog({
  open,
  onClose,
  roles,
  employee,
}: EmployeeFormDialogProps) {
  const isEdit = !!employee;
  const formRef = useRef<HTMLFormElement>(null);

  const [roleId, setRoleId] = useState(employee?.role?.id?.toString() ?? "");
  const [isPending, startTransition] = useTransition();

  function handleClose() {
    if (isPending) return;
    setRoleId(employee?.role?.id?.toString() ?? "");
    onClose();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("roleId", roleId);

    startTransition(async () => {
      try {
        const action = isEdit
          ? updateEmployee(employee.id, formData)
          : createEmployee(formData);
        const { success, message } = await action;
        if (success) {
          toast.success(message);
          formRef.current?.reset();
          setRoleId("");
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
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Karyawan" : "Tambah Karyawan"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Perbarui data karyawan. Kosongkan password jika tidak ingin mengubahnya."
              : "Isi data karyawan baru dan tentukan role-nya."}
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="emp-name">Nama Lengkap</Label>
            <Input
              id="emp-name"
              name="name"
              placeholder="Contoh: Budi Santoso"
              defaultValue={employee?.name}
              disabled={isPending}
              required
            />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <Label htmlFor="emp-username">Username</Label>
            <Input
              id="emp-username"
              name="username"
              placeholder="Contoh: budi.santoso"
              defaultValue={employee?.username}
              disabled={isPending}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="emp-password">
              Password{" "}
              {isEdit && (
                <span className="text-xs text-muted-foreground font-normal">
                  (kosongkan jika tidak berubah)
                </span>
              )}
            </Label>
            <Input
              id="emp-password"
              name="password"
              type="password"
              placeholder={isEdit ? "••••••••" : "Masukkan password"}
              required={!isEdit}
              disabled={isPending}
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={roleId} onValueChange={setRoleId} disabled={isPending}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2 pb-1">
            <input
              type="checkbox"
              id="emp-isActive"
              name="isActive"
              defaultChecked={isEdit ? employee.isActive : true}
              className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            <Label htmlFor="emp-isActive" className="cursor-pointer">
              Karyawan Aktif
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
              disabled={isPending || !roleId}
              className="bg-amber-500 hover:bg-amber-600 min-w-[120px]"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEdit ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Karyawan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
