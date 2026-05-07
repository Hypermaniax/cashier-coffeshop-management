import { z } from "zod";

const MAX_FILE_SIZE = 200 * 1024; // 200KB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const imageSchema = z
  .any()
  .superRefine((file, ctx) => {
    if (!file || typeof file === "string") return;

    if (file && typeof file === "object") {
      // Pastikan property size dan type ada (berarti object File/Blob)
      if (typeof file.size !== "number" || typeof file.type !== "string") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Format file tidak valid atau tidak dikenali.",
        });
        return;
      }

      if (file.size === 0) return; // kosong = tidak upload file baru

      if (file.size > MAX_FILE_SIZE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Ukuran gambar terlalu besar! Maksimal 200KB. (Ukuran filemu: ${Math.round(
            file.size / 1024
          )}KB)`,
        });
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Format tidak didukung (${file.type}). Gunakan JPG, PNG, atau WEBP.`,
        });
      }
    } else {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Input tidak valid, harus berupa file.",
      });
    }
  })
  .transform((file) => {
    if (file && typeof file === "object" && file.size === 0) return undefined;
    if (file === "") return undefined;
    return file;
  });

const modifierGroupIdsSchema = z.preprocess((val) => {
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(val) ? val : [];
}, z.array(z.string()).optional().default([]));

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
  image: imageSchema,
  isActive: z.preprocess(
    (val) => val === "on" || val === "true" || val === true,
    z.boolean(),
  ),
  modifierGroupIds: modifierGroupIdsSchema,
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
  categoryId: z.coerce.number("Kategori wajib diisi"),
  image: imageSchema,
  isActive: z.preprocess(
    (val) => val === "on" || val === "true" || val === true,
    z.boolean(),
  ),
  modifierGroupIds: modifierGroupIdsSchema,
});
