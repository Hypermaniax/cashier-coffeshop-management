"use server";

import { authService } from "@/service/auth";
import { authScema } from "@/utils/validation/auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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
  try {
    const { token, user } = await authService.authenticate(
      validate.data.username,
      validate.data.password,
    );
    cookie.set("token", token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
    });
    revalidatePath("/login");
    return { success: true, message: `Welcome Back ${user.name}` };
  } catch (error: any) {
    return { success: false, message: error.message, inputs: validate.data };
  }
};

export const logOut = async () => {
  const cookie = await cookies();
  cookie.delete("token");
  return { success: true, message: "Logout successfully" };
};
