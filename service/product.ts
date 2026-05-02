import { categoryRepository } from "@/repositories/category";
import { productRepository } from "@/repositories/product";
import { CreateProductDto, UpdateProductDto } from "@/types";

export const productService = {
  async createProduct(data: CreateProductDto) {
    const existedProduct = await productRepository.existProduct(data.name);
    if (existedProduct) throw new Error("Product is already exist!");
    const category = await categoryRepository.getCategoryById(data.categoryId);

    if (!category) throw new Error("Category is not found!");

    const create = await productRepository.createProduct(data, category.id);

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

    const update = await productRepository.updateProduct(id, data);
    return { update };
  },
  async softDeleteProduct(id: string) {
    const product = await productRepository.getProductById(id);
    if (!product) throw new Error("Product is not found!");

    const update = await productRepository.softDelete(id);
    return { update };
  },
};
