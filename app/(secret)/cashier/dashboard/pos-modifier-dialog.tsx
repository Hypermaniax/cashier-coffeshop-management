"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product, CartItemModifier } from "@/types";
import { cn } from "@/lib/utils";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

interface PosModifierDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (product: Product, selectedModifiers: CartItemModifier[], quantity: number) => void;
}

export function PosModifierDialog({
  product,
  open,
  onClose,
  onConfirm,
}: PosModifierDialogProps) {
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (open && product) {
      setQuantity(1);
      const initialSelections: Record<string, string[]> = {};
      
      product.modifierGroups?.forEach((group) => {
        if (group.isRequired && !group.isMultiple && group.options.length > 0) {
          initialSelections[group.id] = [group.options[0].id];
        } else {
          initialSelections[group.id] = [];
        }
      });
      setSelections(initialSelections);
    }
  }, [open, product]);

  if (!product) return null;

  const modifierGroups = product.modifierGroups || [];

  const handleToggleOption = (groupId: string, optionId: string, isMultiple: boolean) => {
    setSelections((prev) => {
      const currentGroupSelections = prev[groupId] || [];
      
      if (isMultiple) {
        if (currentGroupSelections.includes(optionId)) {
          return {
            ...prev,
            [groupId]: currentGroupSelections.filter((id) => id !== optionId),
          };
        } else {
          return {
            ...prev,
            [groupId]: [...currentGroupSelections, optionId],
          };
        }
      } else {
        return {
          ...prev,
          [groupId]: [optionId],
        };
      }
    });
  };

  const calculateTotal = () => {
    let modifiersTotal = 0;
    modifierGroups.forEach((group) => {
      const selectedOptionIds = selections[group.id] || [];
      selectedOptionIds.forEach((optId) => {
        const option = group.options.find((o) => o.id === optId);
        if (option) modifiersTotal += option.additionalPrice;
      });
    });
    return (product.price + modifiersTotal) * quantity;
  };

  const isFormValid = () => {
    return modifierGroups.every((group) => {
      if (group.isRequired) {
        const selected = selections[group.id] || [];
        return selected.length > 0;
      }
      return true;
    });
  };

  const handleConfirm = () => {
    if (!isFormValid()) return;

    const selectedModifiersList: CartItemModifier[] = [];
    modifierGroups.forEach((group) => {
      const selectedOptionIds = selections[group.id] || [];
      selectedOptionIds.forEach((optId) => {
        const option = group.options.find((o) => o.id === optId);
        if (option) {
          selectedModifiersList.push({
            groupId: group.id,
            groupName: group.name,
            optionId: option.id,
            optionName: option.name,
            additionalPrice: option.additionalPrice,
          });
        }
      });
    });

    onConfirm(product, selectedModifiersList, quantity);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-2 border-b">
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
          <DialogDescription>
            Pilih tambahan (modifier) untuk pesanan ini
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {modifierGroups.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              Tidak ada pilihan tambahan untuk menu ini.
            </div>
          ) : (
            modifierGroups.map((group) => {
              const selectedOptionIds = selections[group.id] || [];
              const isMissingRequired = group.isRequired && selectedOptionIds.length === 0;

              return (
                <div key={group.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">
                      {group.name}
                    </h3>
                    <div className="flex gap-2 text-xs">
                      {group.isRequired ? (
                        <span className={cn("px-2 py-0.5 rounded-full font-medium", isMissingRequired ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700")}>
                          Wajib
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                          Opsional
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {group.isMultiple ? "Pilih Banyak" : "Pilih Satu"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {group.options.map((option) => {
                      const isSelected = selectedOptionIds.includes(option.id);
                      return (
                        <Button
                          key={option.id}
                          type="button"
                          variant="outline"
                          onClick={() => handleToggleOption(group.id, option.id, group.isMultiple)}
                          className={cn(
                            "flex h-auto w-full items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 focus-visible:ring-amber-500",
                            isSelected
                              ? "border-amber-500 bg-amber-50/50 hover:bg-amber-100/50 hover:border-amber-600"
                              : "border-border hover:border-amber-300 hover:bg-muted/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "flex items-center justify-center border",
                              group.isMultiple ? "h-5 w-5 rounded" : "h-5 w-5 rounded-full",
                              isSelected ? "bg-amber-500 border-amber-500" : "border-gray-300"
                            )}>
                              {isSelected && group.isMultiple && (
                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                              {isSelected && !group.isMultiple && (
                                <div className="h-2 w-2 rounded-full bg-white" />
                              )}
                            </div>
                            <span className="font-medium text-sm text-foreground">{option.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-muted-foreground">
                            {option.additionalPrice > 0 ? `+${formatRupiah(option.additionalPrice)}` : "Gratis"}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}

          {/* Quantity selector inside dialog */}
          <div className="pt-4 border-t flex items-center justify-between">
            <span className="font-semibold text-foreground">Kuantitas</span>
            <div className="flex items-center gap-4 bg-muted/50 rounded-full p-1 border">
              <Button
                variant="ghost"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-8 w-8 rounded-full hover:bg-muted text-lg"
              >
                -
              </Button>
              <span className="font-bold w-4 text-center">{quantity}</span>
              <Button
                variant="ghost"
                onClick={() => setQuantity((q) => q + 1)}
                disabled={quantity >= product.stock}
                className="h-8 w-8 rounded-full hover:bg-muted text-lg disabled:opacity-50"
              >
                +
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="p-8 border-t bg-background">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">Total Harga</span>
              <span className="text-xl font-bold text-amber-600 leading-none">
                {formatRupiah(calculateTotal())}
              </span>
            </div>
            <Button
              onClick={handleConfirm}
              disabled={!isFormValid()}
              className="bg-amber-500 hover:bg-amber-600 p-6  rounded-full font-semibold shadow-md"
            >
              Tambahkan ke Pesanan
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
