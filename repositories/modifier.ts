import prisma from "@/lib/client";
import { CreateModifierGroupDto, UpdateModifierGroupDto } from "@/types";

export const modifierRepository = {
  async getModifierGroups() {
    return await prisma.modifierGroup.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        options: {
          where: {
            deletedAt: null,
          },
        },
      },
      orderBy: { name: "asc" },
    });
  },
  async getModifierGroupById(id: string) {
    return await prisma.modifierGroup.findFirst({
      where: { 
        id,
        deletedAt: null,
      },
      include: {
        options: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  },
  async createModifierGroup(data: CreateModifierGroupDto) {
    return await prisma.modifierGroup.create({
      data: {
        name: data.name,
        isRequired: data.isRequired,
        isMultiple: data.isMultiple,
        options: {
          create: data.options.map((opt) => ({
            name: opt.name,
            additionalPrice: opt.additionalPrice,
          })),
        },
      },
    });
  },
  async updateModifierGroup(id: string, data: UpdateModifierGroupDto) {
    return await prisma.$transaction(async (tx) => {
      await tx.modifierOption.updateMany({
        where: { modifierGroupId: id },
        data: { deletedAt: new Date() },
      });
      return await tx.modifierGroup.update({
        where: { id },
        data: {
          name: data.name,
          isRequired: data.isRequired,
          isMultiple: data.isMultiple,
          options: {
            create: data.options.map((opt) => ({
              name: opt.name,
              additionalPrice: opt.additionalPrice,
            })),
          },
        },
      });
    });
  },
  async deleteModifierGroup(id: string) {
    return await prisma.$transaction(async (tx) => {
      await tx.modifierOption.updateMany({
        where: { modifierGroupId: id },
        data: { deletedAt: new Date() },
      });
      return await tx.modifierGroup.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    });
  },
};
