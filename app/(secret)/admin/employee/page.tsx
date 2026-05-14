"use server";

import { userRepositories } from "@/repositories/users";
import EmployeTable from "./employee-table";
import { roleRepository } from "@/repositories/roles";

export default async function EmployeePage() {
  const [users, roles] = await Promise.all([
    userRepositories.getUserByRole("cashier"),
    roleRepository.getAll(),
  ]);
  return (
    <>
      <EmployeTable users={users} roles={roles} />
    </>
  );
}
