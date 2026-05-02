import prisma from "@/lib/client";

export const categoryRepository = {
  async getCategoryById(id: number) {
    return await prisma.category.findFirst({
      where: {
        id: id,
      },
    });
  },
  async getCategoryByName(name: string) {
    return await prisma.category.findFirst({
      where: {
        name: name,
      },
    });
  },
  async createCategory(name: string) {
    return await prisma.category.create({
      data: {
        name: name,
      },
    });
  },
  async getCategories() {
    return await prisma.category.findMany({ orderBy: { name: "asc" } });
  },
};
