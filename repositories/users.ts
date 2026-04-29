import prisma from "@/lib/client";
import { CreateUserDto } from "./users.d";

export const createUser = async (data: CreateUserDto) => {
  return await prisma.users.create({
    data: {
      name: data.name,
      username: data.username,
      password: data.password,
      roleId: data.roleId,
      isActive: data.isActive,
    },
  });
};

export const existUser = async (username: string) => {
  return await prisma.users.findUnique({
    where: {
      username,
    },
    include: {
      role: true,
    },
  });
};
