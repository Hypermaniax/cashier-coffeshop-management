"use client";

import { useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  CreditCard,
  ReceiptText,
  ArrowRight,
  Coffee,
  BarChart3,
  Star,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ─────────────────────── Types ─────────────────────── */
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

interface Stats {
  todayOrders: Order[];
  todayRevenue: number;
  productsSold: number;
  totalOrders: number;
}

interface WeeklyRevenue {
  date: string;
  revenue: number;
}

interface TopProduct {
  name: string;
  sold: number;
}

interface Props {
  stats: Stats;
  weeklyRevenue: WeeklyRevenue[];
  topProducts: TopProduct[];
}

/* ─────────────────────── Helpers ─────────────────────── */
function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatTime(date: Date | string) {
  return new Date(date).toLocaleTimeString("id-ID", {
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

/* ─────────────────────── Stat Card ─────────────────────── */
function StatCard({
  title,
  value,
  icon: Icon,
  gradient,
  iconBg,
  sub,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
  sub?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 text-white shadow-lg",
        gradient
      )}
    >
      {/* Decorative circles */}
      <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -right-2 h-28 w-28 rounded-full bg-white/10" />

      <div className="relative z-10">
        <div
          className={cn(
            "mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl",
            iconBg
          )}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <p className="text-sm font-medium text-white/80">{title}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
        {sub && <p className="mt-1 text-xs text-white/60">{sub}</p>}
      </div>
    </div>
  );
}

/* ─────────────────────── Mini Bar Chart ─────────────────────── */
function MiniBarChart({ data }: { data: WeeklyRevenue[] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const today = new Date().toLocaleDateString("id-ID", { weekday: "short" });

  return (
    <div className="flex items-end gap-2 h-28 px-1">
      {data.map((d) => {
        const pct = (d.revenue / max) * 100;
        const isToday = d.date === today;
        return (
          <div
            key={d.date}
            className="flex flex-1 flex-col items-center gap-1.5"
          >
            <div className="relative w-full flex items-end" style={{ height: "90px" }}>
              <div
                className={cn(
                  "w-full rounded-t-md transition-all duration-500",
                  isToday
                    ? "bg-amber-500 shadow-sm shadow-amber-300"
                    : "bg-amber-200"
                )}
                style={{ height: `${Math.max(pct, 4)}%` }}
                title={formatRupiah(d.revenue)}
              />
            </div>
            <span
              className={cn(
                "text-[10px] font-medium",
                isToday ? "text-amber-600 font-bold" : "text-muted-foreground"
              )}
            >
              {d.date}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────── Main Component ─────────────────────── */
export function DashboardContent({ stats, weeklyRevenue, topProducts }: Props) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const todayDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const avgOrderValue =
    stats.totalOrders > 0 ? stats.todayRevenue / stats.totalOrders : 0;

  const maxSold = Math.max(...topProducts.map((p) => p.sold), 1);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Kasir</h1>
          <p className="text-sm text-muted-foreground">{todayDate}</p>
        </div>
        <Link
          href="/cashier"
          id="btn-go-to-pos"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-600 transition-colors"
        >
          <ShoppingBag className="h-4 w-4" />
          Buka Kasir
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Pendapatan Hari Ini"
          value={formatRupiah(stats.todayRevenue)}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-amber-500 to-orange-600"
          iconBg="bg-white/20"
          sub="Total pemasukan hari ini"
        />
        <StatCard
          title="Total Transaksi"
          value={String(stats.totalOrders)}
          icon={ReceiptText}
          gradient="bg-gradient-to-br from-sky-500 to-blue-600"
          iconBg="bg-white/20"
          sub="Transaksi selesai"
        />
        <StatCard
          title="Produk Terjual"
          value={String(stats.productsSold)}
          icon={Coffee}
          gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          iconBg="bg-white/20"
          sub="Item terjual hari ini"
        />
        <StatCard
          title="Rata-rata Order"
          value={formatRupiah(avgOrderValue)}
          icon={CreditCard}
          gradient="bg-gradient-to-br from-violet-500 to-purple-600"
          iconBg="bg-white/20"
          sub="Per transaksi"
        />
      </div>

      {/* Middle row: chart + top products */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Weekly Revenue Chart */}
        <div className="lg:col-span-3 rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-amber-500" />
                Pendapatan 7 Hari Terakhir
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Total:{" "}
                <span className="font-medium text-foreground">
                  {formatRupiah(
                    weeklyRevenue.reduce((acc, d) => acc + d.revenue, 0)
                  )}
                </span>
              </p>
            </div>
          </div>
          {weeklyRevenue.every((d) => d.revenue === 0) ? (
            <div className="flex h-28 items-center justify-center text-sm text-muted-foreground">
              Belum ada data pendapatan minggu ini
            </div>
          ) : (
            <MiniBarChart data={weeklyRevenue} />
          )}
        </div>

        {/* Top Products */}
        <div className="lg:col-span-2 rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="mb-4 font-semibold flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            Produk Terlaris
          </h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Belum ada data produk
            </p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, idx) => {
                const pct = Math.round((product.sold / maxSold) * 100);
                return (
                  <div key={product.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                            idx === 0
                              ? "bg-amber-100 text-amber-700"
                              : idx === 1
                                ? "bg-gray-100 text-gray-600"
                                : idx === 2
                                  ? "bg-orange-50 text-orange-600"
                                  : "bg-muted text-muted-foreground"
                          )}
                        >
                          {idx + 1}
                        </span>
                        <span className="font-medium truncate max-w-[120px]">
                          {product.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {product.sold} terjual
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          idx === 0
                            ? "bg-amber-500"
                            : idx === 1
                              ? "bg-amber-400"
                              : "bg-amber-300"
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-semibold flex items-center gap-2">
            <ReceiptText className="h-4 w-4 text-amber-500" />
            Transaksi Terbaru Hari Ini
          </h2>
          <Link
            href="/cashier/history"
            className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            Lihat semua <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {stats.todayOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Coffee className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              Belum ada transaksi hari ini
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Mulai terima pesanan di halaman Kasir
            </p>
            <Link
              href="/cashier"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
            >
              <ShoppingBag className="h-4 w-4" /> Buka Kasir
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {stats.todayOrders.slice(0, 8).map((order) => {
              const badge = getPaymentBadge(order.paymentMethod);
              const isExpanded = expandedOrder === order.id;
              return (
                <div key={order.id} className="group">
                  <button
                    onClick={() =>
                      setExpandedOrder(isExpanded ? null : order.id)
                    }
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/50 transition-colors text-left"
                  >
                    {/* Order number */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-100">
                      <ReceiptText className="h-4 w-4 text-amber-600" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {order.items.map((i) => i.product.name).join(", ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(order.createdAt)} · {order.items.reduce((a, i) => a + i.quantity, 0)} item
                      </p>
                    </div>

                    {/* Payment method */}
                    <span
                      className={cn(
                        "hidden sm:inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                        badge.className
                      )}
                    >
                      {badge.label}
                    </span>

                    {/* Amount */}
                    <p className="shrink-0 text-sm font-bold text-amber-600">
                      {formatRupiah(order.totalAmount)}
                    </p>

                    {/* Expand icon */}
                    <ChevronUp
                      className={cn(
                        "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
                        !isExpanded && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-5 pb-3 bg-muted/30">
                      <div className="rounded-xl border bg-background p-3 space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-muted-foreground">
                              {item.product.name}{" "}
                              <span className="text-xs">×{item.quantity}</span>
                            </span>
                            <span className="font-medium">
                              {formatRupiah(item.subtotal)}
                            </span>
                          </div>
                        ))}
                        <div className="border-t pt-2 flex items-center justify-between font-semibold">
                          <span>Total</span>
                          <span className="text-amber-600">
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
