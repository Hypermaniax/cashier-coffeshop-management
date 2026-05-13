import { orderRepository } from "@/repositories/order";
import { HistoryContent } from "./history-content";
import { cookies } from "next/headers";
import { validateToken } from "@/utils/jwt";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
  const cookie = await cookies();
  const payload = validateToken(cookie.get("token")?.value || "");
  if (!payload) return redirect("/login");

  const orders = await orderRepository.getOrderByuserId(payload.id);
  return <HistoryContent orders={orders} />;
}
