"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ModifierGroup } from "@/types";
import { ModifierFormDialog } from "./modifier-form-dialog";
import { DeleteModifierDialog } from "./delete-modifier-dialog";
import { cn } from "@/lib/utils";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function ModifierTable({ modifiers }: { modifiers: ModifierGroup[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedModifier, setSelectedModifier] = useState<
    ModifierGroup | undefined
  >(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const handleEdit = (modifier: ModifierGroup) => {
    setSelectedModifier(modifier);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedModifier(undefined);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedModifier(undefined);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleDeleteClose = () => {
    setDeleteId(null);
    setDeleteName("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="h-6 w-6 text-amber-500" />
            Manajemen Modifier
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola grup modifier dan opsi tambahan untuk produk Anda.
          </p>
        </div>
        <Button
          id="btn-tambah-modifier"
          onClick={handleAddNew}
          className="bg-amber-500 hover:bg-amber-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Modifier
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-12 font-semibold">No</TableHead>
              <TableHead className="w-12 font-semibold">
                Nama Modifier
              </TableHead>
              <TableHead className="font-semibold">Tipe</TableHead>
              <TableHead className="font-semibold">Opsi</TableHead>
              <TableHead className="text-center w-28 font-semibold">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modifiers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <SlidersHorizontal className="h-8 w-8 opacity-30" />
                    <p className="font-medium">Belum ada modifier</p>
                    <p className="text-xs">
                      Klik &quot;Tambah Modifier&quot; untuk membuat yang
                      pertama.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              modifiers.map((modifier, index) => (
                <TableRow key={modifier.id}>
                  <TableCell className="text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{modifier.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-semibold",
                          modifier.isRequired
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-green-200 bg-green-50 text-green-700",
                        )}
                      >
                        {modifier.isRequired ? "Wajib" : "Opsional"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-semibold",
                          modifier.isMultiple
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : "border-amber-200 bg-amber-50 text-amber-700",
                        )}
                      >
                        {modifier.isMultiple ? "Multi Pilih" : "Pilih Satu"}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground font-medium">
                        {modifier.options.length} opsi tersedia
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {modifier.options.slice(0, 4).map((opt) => (
                          <Badge
                            key={opt.id}
                            variant="secondary"
                            className="text-[10px]"
                          >
                            {opt.name}
                            {opt.additionalPrice > 0 && (
                              <span className="ml-1 text-muted-foreground">
                                +{formatRupiah(opt.additionalPrice)}
                              </span>
                            )}
                          </Badge>
                        ))}
                        {modifier.options.length > 4 && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] text-muted-foreground"
                          >
                            +{modifier.options.length - 4} lainnya
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1  transition-opacity">
                      <Button
                        id={`btn-edit-modifier-${modifier.id}`}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-amber-50"
                        onClick={() => handleEdit(modifier)}
                      >
                        <Pencil className="h-3.5 w-3.5 text-amber-600" />
                      </Button>
                      <Button
                        id={`btn-delete-modifier-${modifier.id}`}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-red-50"
                        onClick={() =>
                          handleDeleteClick(modifier.id, modifier.name)
                        }
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
      <ModifierFormDialog
        open={isFormOpen}
        onClose={handleFormClose}
        modifierGroup={selectedModifier}
      />
      <DeleteModifierDialog
        open={!!deleteId}
        onClose={handleDeleteClose}
        modifierId={deleteId}
        modifierName={deleteName}
      />
    </div>
  );
}
