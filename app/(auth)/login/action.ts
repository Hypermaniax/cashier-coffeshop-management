"use server";

import { authService } from "@/service/auth";
import { authScema } from "@/utils/validation/auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { checkRateLimit, resetRateLimit } from "@/utils/rateLimit";

async function getClientKey(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  return `login:${ip}`;
}

export const login = async (_: any, formData: FormData) => {
  const data = Object.fromEntries(formData.entries());
  const validate = authScema.safeParse(data);
  const cookie = await cookies();

  if (!validate.success)
    return {
      success: false,
      message: validate.error.issues[0].message,
      inputs: validate.data,
    };

  const limit = checkRateLimit(await getClientKey());
  if (!limit.allowed) {
    return {
      success: false,
      message: `Terlalu banyak percobaan login. Coba lagi dalam ${limit.retryAfterSec} detik.`,
    };
  }

  try {
    const { token, user } = await authService.authenticate(
      validate.data.username,
      validate.data.password,
    );
    resetRateLimit(await getClientKey());
    cookie.set("token", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
    });
    revalidatePath("/login");
    return { 
      success: true, 
      message: `Welcome Back ${user.name}`,
      role: user.role.name 
    };
  } catch (error: any) {
    return { success: false, message: error.message, inputs: validate.data };
  }
};

export const logOut = async () => {
  const cookie = await cookies();
  cookie.delete("token");
  return { success: true, message: "Logout successfully" };
};

