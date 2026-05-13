import prisma from "@/lib/client";
import { hashPassword } from "../utils/bcrypt";

async function main() {
  const adminPassword = await hashPassword("Sewdaq123");
  const cashierPassword = await hashPassword("Sewdaq123");

  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
    },
  });

  const cashierRole = await prisma.role.upsert({
    where: { name: "cashier" },
    update: {},
    create: {
      name: "cashier",
    },
  });

  const admin = await prisma.users.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      name: "Admin User",  
      username: "admin",
      password: adminPassword,
      roleId: adminRole.id,
    },
  });

  const cashier = await prisma.users.upsert({
    where: { username: "cashier" },
    update: {},
    create: {
      name: "Cashier User",
      username: "cashier",
      password: cashierPassword,
      roleId: cashierRole.id,
    },
  });

  console.log("Seeding finished.");
  console.log({ admin, cashier });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
