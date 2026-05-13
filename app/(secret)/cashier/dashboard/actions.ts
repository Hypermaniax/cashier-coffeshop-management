"use server";

import { cookies } from "next/headers";
import { validateToken } from "@/utils/jwt";
import { orderRepository } from "@/repositories/order";
import { revalidatePath } from "next/cache";

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
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Sesi kasir tidak valid. Silakan login kembali." };
    }

    const authPayload = validateToken(token);
    
    if (!authPayload || !authPayload.id) {
        return { success: false, message: "Kasir tidak ditemukan." };
    }

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
