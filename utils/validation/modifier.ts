import { z } from "zod";

export const modifierOptionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama opsi tidak boleh kosong"),
  additionalPrice: z.coerce
    .number({ invalid_type_error: "Harga tambahan harus berupa angka" })
    .min(0, "Harga tambahan tidak boleh negatif")
    .transform((val) => Number(val)),
});

export const createModifierGroupSchema = z.object({
  name: z.string().min(1, "Nama modifier tidak boleh kosong"),
  isRequired: z.boolean(),
  isMultiple: z.boolean(),
  options: z.array(modifierOptionSchema).min(1, "Minimal harus ada 1 opsi modifier"),
});

export const updateModifierGroupSchema = createModifierGroupSchema;
