import { orderRepository } from "@/repositories/order";
import { HistoryContent } from "./history-content";

export default async function HistoryPage() {
  const orders = await orderRepository.getOrders();
  return <HistoryContent orders={orders} />;
}
