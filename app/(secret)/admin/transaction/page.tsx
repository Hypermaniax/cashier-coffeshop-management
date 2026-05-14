"use server";

import { orderRepository } from "@/repositories/order";
import { PeriodFilter } from "./period-filter";
import { Suspense } from "react";
import { PaymentFilter } from "./payment-filter";
import { formater } from "@/utils/formatter";
import { Pagination } from "./pagination";

type Period = "daily" | "weekly" | "monthly" | "all";
type PaymentMethod = "CASH" | "QRIS" | "DEBIT" | "all";

const PAGE_SIZE = 10;

function getDateRange(period: Period): { start: Date; end: Date } | null {
  if (period === "all") return null;

  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const start = new Date(now);
  if (period === "daily") {
    start.setHours(0, 0, 0, 0);
  } else if (period === "weekly") {
    const day = now.getDay();
    start.setDate(now.getDate() - day);
    start.setHours(0, 0, 0, 0);
  } else if (period === "monthly") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }

  return { start, end };
}

function periodLabel(period: Period) {
  if (period === "daily") return "Hari Ini";
  if (period === "weekly") return "Minggu Ini";
  if (period === "monthly") return "Bulan Ini";
  return "Semua Waktu";
}

export default async function TransactionPage({
  searchParams,
}: {
  searchParams: Promise<{
    period?: string;
    "payment-method"?: string;
    page?: string;
  }>;
}) {
  const {
    period: rawPeriod,
    "payment-method": rawPayment,
    page: rawPage,
  } = await searchParams;

  const period: Period =
    rawPeriod === "daily" || rawPeriod === "weekly" || rawPeriod === "monthly"
      ? rawPeriod
      : "all";

  const paymentMethod: PaymentMethod =
    rawPayment === "CASH" || rawPayment === "QRIS" || rawPayment === "DEBIT"
      ? rawPayment
      : "all";

  const page = Math.max(1, parseInt(rawPage ?? "1", 10) || 1);

  const range = getDateRange(period);

  const { data: orders, total, totalPages } =
    await orderRepository.getOrdersPagination({
      paymentMethod: paymentMethod === "all" ? undefined : paymentMethod,
      dateStart: range?.start,
      dateEnd: range?.end,
      page,
      pageSize: PAGE_SIZE,
    });

  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const totalItems = orders.reduce(
    (s, o) => s + o.items.reduce((si, i) => si + i.quantity, 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transaksi</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {periodLabel(period)}
            {paymentMethod !== "all" && (
              <>
                {" "}
                &middot;{" "}
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                  {paymentMethod}
                </span>
              </>
            )}{" "}
            &middot; {total} transaksi
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Suspense>
            <PeriodFilter />
            <PaymentFilter />
          </Suspense>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Transaksi", value: total.toString() },
          { label: "Total Item Terjual (Halaman Ini)", value: totalItems.toString() },
          {
            label: "Pendapatan (Halaman Ini)",
            value: formater.rupiahFormater(totalRevenue),
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border bg-white px-5 py-4 shadow-sm"
          >
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className="text-xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {orders.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <p className="text-muted-foreground text-sm">
            Tidak ada transaksi untuk periode ini.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr] gap-4 px-5 py-3 bg-muted/40 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <span>ID</span>
            <span>Item</span>
            <span>Kasir</span>
            <span>Waktu</span>
            <span className="text-right">Total</span>
          </div>

          <div className="divide-y">
            {orders.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr] gap-4 px-5 py-4 hover:bg-muted/20 transition-colors items-start"
              >
                <div>
                  <p className="text-sm font-mono font-semibold">
                    #{order.id.slice(-6).toUpperCase()}
                  </p>
                  <span className="inline-block mt-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                    {order.status}
                  </span>
                </div>

                <div className="space-y-0.5">
                  {order.items.map((item) => (
                    <p key={item.id} className="text-sm text-foreground/80">
                      <span className="font-medium">{item.quantity}x</span>{" "}
                      {item.product.name}
                      <span className="text-muted-foreground ml-1 text-xs">
                        ({formater.rupiahFormater(item.subtotal)})
                      </span>
                    </p>
                  ))}
                </div>

                <div>
                  <p className="text-sm">{order.cashier?.name ?? "-"}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {order.paymentMethod?.toLowerCase().replace("_", " ")}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground">
                  {formater.dateFormatter(order.createdAt)}
                </p>

                <p className="text-sm font-semibold text-right">
                  {formater.rupiahFormater(order.totalAmount)}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination footer */}
          <div className="px-5 py-4 border-t bg-muted/20 flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              Halaman {page} dari {totalPages} &middot; {total} transaksi
            </p>
            <Suspense>
              <Pagination currentPage={page} totalPages={totalPages} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}
