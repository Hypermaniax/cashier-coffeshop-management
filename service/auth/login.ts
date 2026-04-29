"use server";

import { existUser } from "@/repositories/users";
import { comparePassword } from "@/utils/bcrypt";
import { generateToken } from "@/utils/jwt";
import { authScema } from "@/utils/validation/auth";
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

  const existedUser = await existUser(validate.data.username);
  console.log(existedUser);
  if (!existedUser)
    return {
      success: false,
      message: "Username not found",
      inputs: validate.data,
    };

  if (!existedUser?.isActive)
    return {
      success: false,
      message: "User not active",
      inputs: validate.data,
    };

  const isMatch = await comparePassword(
    validate.data.password,
    existedUser.password ?? "",
  );

  if (!isMatch)
    return {
      success: false,
      message: "Incorrect password",
      inputs: validate.data,
    };

  const safetyPayload = {
    id: existedUser.id,
    name: existedUser.name,
    role: existedUser.role.name,
    isActive: existedUser.isActive,
  };
  const token = await generateToken(safetyPayload);

  cookie.set("token", token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
  });

  return { success: true, message: "Login successfully" };
};
