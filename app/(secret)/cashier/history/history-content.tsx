"use client";

import { useState, useMemo } from "react";
import {
  ReceiptText,
  Search,
  Coffee,
  ChevronUp,
  CalendarDays,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
interface OrderItem {
  product: { name: string; price: number };
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: Date | string;
  cashier: { name: string };
  items: OrderItem[];
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPaymentBadge(method: string) {
  const map: Record<string, { label: string; className: string }> = {
    CASH: {
      label: "Tunai",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    QRIS: {
      label: "QRIS",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    CARD: {
      label: "Kartu",
      className: "bg-purple-50 text-purple-700 border-purple-200",
    },
  };
  return (
    map[method] ?? {
      label: method,
      className: "bg-gray-50 text-gray-700 border-gray-200",
    }
  );
}

export function HistoryContent({ orders }: { orders: Order[] }) {
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [filterPayment, setFilterPayment] = useState("ALL");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt)
        .toISOString()
        .split("T")[0];
      const matchSearch =
        search === "" ||
        order.items.some((i) =>
          i.product.name.toLowerCase().includes(search.toLowerCase())
        ) ||
        order.cashier.name.toLowerCase().includes(search.toLowerCase());
      const matchDate = !filterDate || orderDate === format(filterDate, "yyyy-MM-dd");
      const matchPayment =
        filterPayment === "ALL" || order.paymentMethod === filterPayment;
      return matchSearch && matchDate && matchPayment;
    });
  }, [orders, search, filterDate, filterPayment]);

  const totalRevenue = filtered.reduce((a, o) => a + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Riwayat Transaksi</h1>
        <p className="text-sm text-muted-foreground">
          Semua transaksi yang telah diproses
        </p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <ReceiptText className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Transaksi</p>
            <p className="text-lg font-bold">{filtered.length}</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Pendapatan</p>
            <p className="text-lg font-bold">{formatRupiah(totalRevenue)}</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <CreditCard className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Rata-rata Order</p>
            <p className="text-lg font-bold">
              {filtered.length > 0
                ? formatRupiah(totalRevenue / filtered.length)
                : "Rp 0"}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            id="history-search"
            type="text"
            placeholder="Cari produk atau kasir..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl pl-9 bg-background focus-visible:ring-amber-500/30 focus-visible:border-amber-400"
          />
        </div>

        {/* Date filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] justify-start text-left font-normal rounded-xl bg-background border-border hover:bg-background/80",
                !filterDate && "text-muted-foreground"
              )}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {filterDate ? format(filterDate, "PPP", { locale: idLocale }) : <span>Pilih tanggal</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filterDate}
              onSelect={setFilterDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Payment method filter */}
        <Select value={filterPayment} onValueChange={setFilterPayment}>
          <SelectTrigger className="w-[180px] rounded-xl bg-background focus:ring-amber-500/30 focus:border-amber-400">
            <SelectValue placeholder="Metode Pembayaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Metode</SelectItem>
            <SelectItem value="CASH">Tunai</SelectItem>
            <SelectItem value="QRIS">QRIS</SelectItem>
            <SelectItem value="CARD">Kartu</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear filters */}
        {(search || filterDate || filterPayment !== "ALL") && (
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setFilterDate(undefined);
              setFilterPayment("ALL");
            }}
            className="rounded-xl border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
          >
            Reset Filter
          </Button>
        )}
      </div>

      {/* Orders list */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Coffee className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              Tidak ada transaksi ditemukan
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Coba ubah filter pencarian
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((order) => {
              const badge = getPaymentBadge(order.paymentMethod);
              const isExpanded = expandedOrder === order.id;
              const totalItems = order.items.reduce(
                (a, i) => a + i.quantity,
                0
              );

              return (
                <div key={order.id}>
                  <button
                    onClick={() =>
                      setExpandedOrder(isExpanded ? null : order.id)
                    }
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors text-left"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-100">
                      <ReceiptText className="h-4 w-4 text-amber-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {order.items.map((i) => i.product.name).join(", ")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDateTime(order.createdAt)} · {totalItems} item
                        · Kasir: {order.cashier.name}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "hidden sm:inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        badge.className
                      )}
                    >
                      {badge.label}
                    </span>

                    <p className="shrink-0 text-base font-bold text-amber-600">
                      {formatRupiah(order.totalAmount)}
                    </p>

                    <ChevronUp
                      className={cn(
                        "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
                        !isExpanded && "rotate-180"
                      )}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-4 bg-muted/20">
                      <div className="rounded-xl border bg-background p-4 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          Detail Pesanan
                        </p>
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span className="h-5 w-5 rounded-full bg-amber-50 flex items-center justify-center text-[10px] font-bold text-amber-700">
                                {item.quantity}
                              </span>
                              <span>{item.product.name}</span>
                            </div>
                            <span className="font-medium">
                              {formatRupiah(item.subtotal)}
                            </span>
                          </div>
                        ))}
                        <div className="border-t pt-3 flex items-center justify-between">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold text-amber-600">
                            {formatRupiah(order.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
