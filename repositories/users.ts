import prisma from "@/lib/client";
import { CreateUserDto } from "@/types";

export const userRepositories = {
  async getUserByRole(role: string) {
    return await prisma.users.findMany({
      where: {
        role: {
          name: role,
        },
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        username: true,
        isActive: true,
        createdAt: true,
        role: true,
      },
    });
  },
  async existUser(username: string) {
    return await prisma.users.findUnique({
      where: {
        username,
      },
      include: {
        role: true,
      },
    });
  },
  async createUser(data: CreateUserDto) {
    return await prisma.users.create({
      data: {
        name: data.name,
        username: data.username,
        password: data.password,
        roleId: data.roleId,
        isActive: data.isActive,
      },
    });
  },
  async updateUser(
    id: string,
    data: {
      name: string;
      username: string;
      password?: string;
      roleId: number;
      isActive: boolean;
    },
  ) {
    return await prisma.users.update({
      where: { id },
      data,
    });
  },
  async softDeleteUser(id: string) {
    return await prisma.users.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },
  async getUserById(id: string) {
    return await prisma.users.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });
  },
};
