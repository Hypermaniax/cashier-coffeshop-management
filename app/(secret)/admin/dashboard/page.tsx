import { orderRepository } from "@/repositories/order";
import { productRepository } from "@/repositories/product";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const [stats, weeklyRevenue, topProducts, allProducts] = await Promise.all([
    orderRepository.getTodayStats(),
    orderRepository.getWeeklyRevenue(),
    orderRepository.getTopProducts(),
    productRepository.getProducts(),
  ]);

  return (
    <>
      <Dashboard 
        stats={stats}
        weeklyRevenue={weeklyRevenue}
        topProducts={topProducts}
        allProducts={allProducts}
      />
    </>
  );
}
