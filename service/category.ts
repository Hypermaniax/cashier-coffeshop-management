import { categoryRepository } from "@/repositories/category";

export const categoryService = {
  async createCategory(name: string) {
    const existedCategory = await categoryRepository.getCategoryByName(name);
    if (existedCategory) throw new Error("Category is already exist!");

    const create = await categoryRepository.createCategory(name);

    return create;
  },
};
