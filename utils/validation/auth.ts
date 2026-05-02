import { z } from "zod";

export const authScema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(3, "Password minimal 3 karakter"),
});

export const createEmployeeSchema = z.object({
  name: z.string().min(3, "Name minimal 3 karakter"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(3, "Password minimal 3 karakter"),
  roleId: z.coerce.number().min(1, "Select the Employee Role"),
  isActive: z.coerce.boolean(),
});

export const updateEmployeeSchema = z.object({
  name: z.string().min(3, "Name minimal 3 karakter"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().min(5, "Password minimal 5 karakter").optional()
  ),
  roleId: z.coerce.number().min(1, "Select the Employee Role"),
  isActive: z.coerce.boolean(),
});
