"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ModifierFormDialogProps } from "@/types";
import { toast } from "sonner";
import { createModifierGroupAction, updateModifierGroupAction } from "./actions";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface OptionState {
  id?: string;
  name: string;
  additionalPrice: string; // keep as string to avoid NaN in controlled input
}

const defaultOption = (): OptionState => ({ name: "", additionalPrice: "" });

export function ModifierFormDialog({
  open,
  onClose,
  modifierGroup,
}: ModifierFormDialogProps) {
  const isEditing = !!modifierGroup;
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [isRequired, setIsRequired] = useState(true);
  const [isMultiple, setIsMultiple] = useState(true);
  const [options, setOptions] = useState<OptionState[]>([defaultOption()]);

  // Reset form state whenever dialog opens
  useEffect(() => {
    if (!open) return;
    if (modifierGroup) {
      setName(modifierGroup.name);
      setIsRequired(modifierGroup.isRequired);
      setIsMultiple(modifierGroup.isMultiple);
      setOptions(
        modifierGroup.options.map((opt) => ({
          id: opt.id,
          name: opt.name,
          additionalPrice: String(opt.additionalPrice),
        }))
      );
    } else {
      setName("");
      setIsRequired(true);
      setIsMultiple(true);
      setOptions([defaultOption()]);
    }
  }, [open, modifierGroup]);

  const handleAddOption = () => {
    setOptions((prev) => [...prev, defaultOption()]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOptionChange = (
    index: number,
    field: keyof OptionState,
    value: string
  ) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      // Convert string additionalPrice back to number for server action
      const data = {
        name,
        isRequired,
        isMultiple,
        options: options.map((opt) => ({
          ...opt,
          additionalPrice: parseFloat(opt.additionalPrice) || 0,
        })),
      };

      const result = isEditing
        ? await updateModifierGroupAction(modifierGroup.id, data)
        : await createModifierGroupAction(data);

      if (result.success) {
        toast.success(result.message);
        onClose();
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleOpenChange = (val: boolean) => {
    if (!val && !isPending) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Modifier" : "Tambah Modifier"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Perbarui nama, tipe, dan daftar opsi modifier."
              : "Isi nama, tipe, dan daftar opsi untuk modifier baru."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="modifier-name">Nama Grup Modifier</Label>
            <Input
              id="modifier-name"
              placeholder="Misal: Ukuran, Topping, Level Gula"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              required
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* isRequired toggle */}
            <button
              type="button"
              onClick={() => setIsRequired((prev) => !prev)}
              disabled={isPending}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all ${
                isRequired
                  ? "border-red-400 bg-red-50 text-red-700"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
              }`}
            >
              <span
                className={`h-3 w-3 rounded-full transition-colors ${
                  isRequired ? "bg-red-500" : "bg-gray-300"
                }`}
              />
              {isRequired ? "Wajib Dipilih" : "Opsional"}
            </button>

            {/* isMultiple toggle */}
            <button
              type="button"
              onClick={() => setIsMultiple((prev) => !prev)}
              disabled={isPending}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all ${
                isMultiple
                  ? "border-blue-400 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
              }`}
            >
              <span
                className={`h-3 w-3 rounded-full transition-colors ${
                  isMultiple ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
              {isMultiple ? "Bisa Pilih Banyak" : "Pilih Satu Saja"}
            </button>
          </div>

          {/* Options list */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label>Daftar Opsi</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                disabled={isPending}
                className="h-8 gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah Opsi
              </Button>
            </div>

            {options.length === 0 ? (
              <p className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
                Belum ada opsi. Klik &quot;Tambah Opsi&quot; untuk mulai.
              </p>
            ) : (
              <div className="space-y-2">
                {/* Header labels */}
                <div className="grid grid-cols-[1fr_120px_36px] gap-2 px-1">
                  <span className="text-xs font-medium text-muted-foreground">Nama Opsi</span>
                  <span className="text-xs font-medium text-muted-foreground">Harga Tambahan</span>
                  <span />
                </div>
                {options.map((option, idx) => (
                  <div key={idx} className="grid grid-cols-[1fr_120px_36px] items-center gap-2">
                    <Input
                      placeholder="Contoh: Large"
                      value={option.name}
                      onChange={(e) => handleOptionChange(idx, "name", e.target.value)}
                      disabled={isPending}
                      required
                    />
                    <Input
                      type="number"
                      min="0"
                      step="500"
                      placeholder="0"
                      value={option.additionalPrice}
                      onChange={(e) =>
                        handleOptionChange(idx, "additionalPrice", e.target.value)
                      }
                      onFocus={(e) => e.target.select()}
                      disabled={isPending}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                      onClick={() => handleRemoveOption(idx)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending || options.length === 0}
              className="bg-amber-500 hover:bg-amber-600 min-w-[90px]"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEditing ? (
                "Simpan Perubahan"
              ) : (
                "Tambah"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
