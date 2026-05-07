import { categoryRepository } from "@/repositories/category";
import { productRepository } from "@/repositories/product";
import { CreateProductDto, UpdateProductDto } from "@/types";
import { supabaseService } from "@/utils/supabase";

export const productService = {
  async createProduct(data: CreateProductDto) {
    const existedProduct = await productRepository.existProduct(data.name);
    if (existedProduct) throw new Error("Product is already exist!");
    const category = await categoryRepository.getCategoryById(data.categoryId);

    if (!category) throw new Error("Category is not found!");

    const uploadedMenuImageUrl =
      data?.image
        ? await supabaseService.uploadImage(data?.image as File)
        : null;

    if (uploadedMenuImageUrl) {
      data.image = uploadedMenuImageUrl;
    }
    const create = await productRepository.createProduct(data, category.id);
    const modifierGroupIds = data.modifierGroupIds || [];
    if (modifierGroupIds.length > 0) {
      await productRepository.setProductModifiers(create.id, modifierGroupIds);
    }

    return { create, category };
  },
  async updateProduct(id: string, data: UpdateProductDto) {
    const product = await productRepository.getProductById(id);
    if (!product) throw new Error("Product is not found!");

    const category = await categoryRepository.getCategoryById(data.categoryId);
    if (!category) throw new Error("Category is not found!");

    if (data.name !== product.name) {
      const existedProduct = await productRepository.existProduct(data.name);
      if (existedProduct) throw new Error("Product is already exist!");
    }
    if (data?.image && typeof data.image !== "string") {
      const uploadedMenuImageUrl = await supabaseService.uploadImage(data.image as File);
      data.image = uploadedMenuImageUrl;

      if (product.image) {
        const oldFileName = product.image.split("/").pop();
        if (oldFileName) {
          await supabaseService.deleteImage(oldFileName).catch((err) => 
            console.error("Gagal menghapus gambar lama:", err)
          );
        }
      }
    } else if (data.image === undefined) {
      delete data.image;
    }
    const update = await productRepository.updateProduct(id, data);

    const modifierGroupIds = data.modifierGroupIds || [];
    await productRepository.setProductModifiers(id, modifierGroupIds);

    return { update };
  },
  async softDeleteProduct(id: string) {
    const product = await productRepository.getProductById(id);
    if (!product) throw new Error("Product is not found!");

    const update = await productRepository.softDelete(id);
    return { update };
  },
};
