import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  price: z.coerce
    .number()
    .positive("Harga harus positif")
    .transform((val) => Number(val)),
  stock: z.coerce
    .number()
    .positive("Stock harus positif")
    .transform((val) => Number(val)),
  categoryId: z.coerce.number("select the category first"),
  image: z.string().optional().or(z.literal("")),
  isActive: z.preprocess((val) => val === "on" || val === "true" || val === true, z.boolean()),
});

export const updateProductSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  price: z.coerce
    .number()
    .positive("Harga harus positif")
    .transform((val) => Number(val)),
  stock: z.coerce
    .number()
    .positive("Stock harus positif")
    .transform((val) => Number(val)),
  categoryId: z.coerce.number( "Kategori wajib diisi" ),
  image: z.string().optional().or(z.literal("")),
  isActive: z.preprocess((val) => val === "on" || val === "true" || val === true, z.boolean()),
});
