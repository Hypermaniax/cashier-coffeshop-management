"use server";

import { orderRepository } from "@/repositories/order";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

export async function submitOrderAction(data: {
  totalAmount: number;
  paymentMethod: string;
  items: {
    productId: string;
    quantity: number;
    subtotal: number;
    modifiers?: {
      groupId: string;
      groupName: string;
      optionId: string;
      optionName: string;
      additionalPrice: number;
    }[];
  }[];
}) {
  try {
    const authPayload = await requireAuth("CASHIER");

    await orderRepository.createOrder({
      cashierId: authPayload.id,
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod,
      items: data.items,
    });

    revalidatePath("/cashier");
    revalidatePath("/cashier/dashboard");
    revalidatePath("/cashier/history");

    return { success: true, message: "Transaksi berhasil diproses!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal memproses transaksi." };
  }
}
