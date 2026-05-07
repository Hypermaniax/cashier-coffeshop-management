"use client";

import { DashboardProps } from "@/types";
import { formater } from "@/utils/formatter";
import { TrendingUp, ShoppingBag, BarChart3, Package } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  revenue: {
    label: "Pendapatan",
    color: "#fbbf24",
  },
} satisfies ChartConfig;

export default function Dashboard({
  stats,
  weeklyRevenue,
  topProducts,
  allProducts,
}: DashboardProps) {
  const activeProducts = allProducts.filter((p) => p.isActive).length;

  const statCards = [
    {
      title: "Pendapatan Hari Ini",
      value: formater.rupiahFormater(stats.todayRevenue),
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      sub: `${stats.totalOrders} transaksi`,
    },
    {
      title: "Item Terjual Hari Ini",
      value: stats.productsSold.toString(),
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      sub: "Total item",
    },
    {
      title: "Total Transaksi",
      value: stats.totalOrders.toString(),
      icon: BarChart3,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      sub: "Hari ini",
    },
    {
      title: "Produk Aktif",
      value: activeProducts.toString(),
      icon: Package,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-200",
      sub: `Dari ${allProducts.length} produk`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Ringkasan performa toko hari ini
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`rounded-xl border ${card.border} bg-white p-5 shadow-sm flex items-start gap-4`}
          >
            <div className={`rounded-lg ${card.bg} p-2.5 shrink-0`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground truncate">
                {card.title}
              </p>
              <p className="text-xl font-bold mt-0.5 truncate">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Revenue Bar Chart */}
        <div className="lg:col-span-2 rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-sm mb-4">
            Pendapatan 7 Hari Terakhir
          </h2>
          <ChartContainer config={chartConfig} className="h-[180px] w-full">
            <BarChart data={weeklyRevenue} margin={{ top: 10, left: 0, right: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                fontSize={11}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent 
                    formatter={(value) => formater.rupiahFormater(value as number)} 
                  />
                }
              />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Top Products */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-sm mb-4">Produk Terlaris</h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Belum ada data penjualan
            </p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, idx) => {
                const maxSold = topProducts[0]?.sold ?? 1;
                const pct = maxSold > 0 ? (product.sold / maxSold) * 100 : 0;
                return (
                  <div key={product.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-600 w-4">
                          #{idx + 1}
                        </span>
                        <span className="text-sm font-medium truncate max-w-[120px]">
                          {product.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {product.sold} terjual
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-amber-100">
                      <div
                        className="h-1.5 rounded-full bg-amber-400"
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

      {/* Recent Orders */}
      {stats.todayOrders.length > 0 && (
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="font-semibold text-sm">
              Transaksi Terbaru Hari Ini
            </h2>
            <span className="text-xs text-muted-foreground">
              {stats.todayOrders.length} transaksi
            </span>
          </div>
          <div className="divide-y">
            {stats.todayOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    #{order.id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.items.length} item ·{" "}
                    {new Date(order.createdAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {formater.rupiahFormater(order.totalAmount)}
                  </p>
                  <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
