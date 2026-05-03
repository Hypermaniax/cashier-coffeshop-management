import { orderRepository } from "@/repositories/order";
import { DashboardContent } from "./dashboard-content";

export default async function CashierDashboardPage() {
  const [stats, weeklyRevenue, topProducts] = await Promise.all([
    orderRepository.getTodayStats(),
    orderRepository.getWeeklyRevenue(),
    orderRepository.getTopProducts(),
  ]);

  return (
    <DashboardContent
      stats={stats}
      weeklyRevenue={weeklyRevenue}
      topProducts={topProducts}
    />
  );
}
