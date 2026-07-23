"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { QrCode, Loader2, AlertTriangle } from "lucide-react";
import { getQrisDataUrl } from "./qris-action";

interface QrisModalProps {
  open: boolean;
  onClose: () => void;
  totalAmount: number;
  isPending: boolean;
  onConfirm: () => void;
}

export function QrisModal({
  open,
  onClose,
  totalAmount,
  isPending,
  onConfirm,
}: QrisModalProps) {
  const [src, setSrc] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setStatus("loading");
    setSrc("");
    getQrisDataUrl().then((res) => {
      if (cancelled) return;
      if (res.ok && res.dataUrl) {
        setSrc(res.dataUrl);
        setStatus("ready");
      } else {
        setStatus("error");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !isPending && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-blue-600" />
            Pembayaran QRIS
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border bg-muted/30 p-4 text-center">
            <p className="text-xs text-muted-foreground">Total Pembayaran</p>
            <p className="text-2xl font-black text-amber-600">
              {formatRupiah(totalAmount)}
            </p>
          </div>

          <div className="flex h-64 w-full items-center justify-center rounded-xl border bg-white">
            {status === "loading" && (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            )}
            {status === "ready" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt="QRIS"
                className="h-full w-full object-contain p-2"
              />
            )}
            {status === "error" && (
              <div className="flex flex-col items-center gap-2 px-4 text-center text-muted-foreground">
                <AlertTriangle className="h-8 w-8 text-amber-500" />
                <p className="text-sm">
                  QRIS belum tersedia. Hubungi admin untuk mengunggah QRIS.
                </p>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Tunjukkan kode ini ke pembeli, lalu klik konfirmasi setelah dibayar.
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              className="flex-1 bg-amber-500 hover:bg-amber-600"
              onClick={onConfirm}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...
                </>
              ) : (
                "Konfirmasi Bayar"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

