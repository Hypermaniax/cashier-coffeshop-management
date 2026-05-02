import { userRepositories } from "@/repositories/users";
import { CreateEmployeeDto, UpdateEmployeeDto } from "@/types";
import { comparePassword, hashPassword } from "@/utils/bcrypt";
import { generateToken } from "@/utils/jwt";

export const authService = {
  async authenticate(username: string, password: string) {
    const user = await userRepositories.existUser(username);
    if (!user) throw new Error("User not found");
    if (!user.isActive) throw new Error("User not active");

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error("Incorrect Password");

    const safetyPayload = {
      id: user.id,
      name: user.name,
      role: user.role.name,
    };
    const token = await generateToken(safetyPayload);

    return { user, token };
  },
  async createUser(data: CreateEmployeeDto) {
    const existed = await userRepositories.existUser(data.username);
    if (existed) throw new Error("User already exists");
    const password = await hashPassword(data.password);
    const payload = {
      ...data,
      password,
    };
    const create = await userRepositories.createUser(payload);

    return { create };
  },
  async updateUser(id: string, data: UpdateEmployeeDto) {
    if (!id) throw new Error("User not found");
    const existed = await userRepositories.existUser(data.username);
    if (existed && existed.id !== id) throw new Error("User already exists");

    const password = data.password
      ? await hashPassword(data.password)
      : existed?.password;

    const payload = {
      ...data,
      password,
    };
    const update = await userRepositories.updateUser(id, payload);
    return { update };
  },
  async sofDeleteUser(id: string) {
    const existed = await userRepositories.getUserById(id);
    if (!existed) throw new Error("User not found");
    const update = await userRepositories.softDeleteUser(id);
    return { update };
  },
};
