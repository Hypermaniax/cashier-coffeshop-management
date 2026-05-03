import prisma from "@/lib/client";
import { CreateProductDto, UpdateProductDto } from "@/types";

export const productRepository = {
  async existProduct(name: string) {
    return await prisma.product.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  },
  async createProduct(data: CreateProductDto, categoryId: number) {
    return await prisma.product.create({
      data: {
        categoryId: categoryId,
        name: data.name,
        price: data.price,
        stock: data.stock,
        image: data.image,
        isActive: data.isActive,
      },
    });
  },
  async updateProduct(id: string, data: UpdateProductDto) {
    return await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        name: data.name,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        image: data.image,
        isActive: data.isActive,
      },
    });
  },
  async softDelete(id: string) {
    return await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  },
  async getProducts() {
    return await prisma.product.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        category: true,
        modifierGroups: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },
  async getProductById(id: string) {
    return await prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        category: true,
        modifierGroups: true,
      },
    });
  },
  async setProductModifiers(productId: string, modifierGroupIds: string[]) {
    return await prisma.product.update({
      where: { id: productId },
      data: {
        modifierGroups: {
          set: modifierGroupIds.map((id) => ({ id })),
        },
      },
    });
  },
};
