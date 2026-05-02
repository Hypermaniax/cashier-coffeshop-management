import prisma from "@/lib/client";

export const roleRepository = {
  async getAll() {
    return await prisma.role.findMany();
  },
};
