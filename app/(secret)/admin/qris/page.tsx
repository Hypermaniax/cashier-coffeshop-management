"use client";

import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { uploadQris } from "./action";
import { getQrisDataUrl } from "../../cashier/dashboard/qris-action";

export default function QrisPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  async function loadPreview() {
    const res = await getQrisDataUrl();
    setPreview(res.ok ? (res.dataUrl ?? null) : null);
  }

  useEffect(() => {
    loadPreview();
  }, []);

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      toast.error("Pilih file gambar QRIS terlebih dahulu");
      return;
    }
    const fd = new FormData();
    fd.set("qris", file);
    startTransition(async () => {
      const res = await uploadQris(fd);
      if (res.success) {
        toast.success(res.message);
        await loadPreview();
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pengaturan QRIS</h1>
        <p className="text-sm text-muted-foreground">
          Unggah gambar QRIS pembayaran. Hanya admin yang dapat mengubah.
          File diproteksi dan diperiksa integritasnya setiap kali ditampilkan.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>QRIS Aktif</CardTitle>
          <CardDescription>Pratinjau QRIS yang sedang digunakan kasir.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="QRIS"
              className="mx-auto h-64 w-64 rounded-lg border bg-white object-contain"
            />
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              QRIS belum diunggah.
            </p>
          )}

          <form onSubmit={onSubmit} className="space-y-3">
            <Input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onSelect}
              disabled={isPending}
            />
            <Button type="submit" disabled={isPending || !file} className="w-full">
              {isPending ? "Menyimpan..." : "Unggah / Perbarui QRIS"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
