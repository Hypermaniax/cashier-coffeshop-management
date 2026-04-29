import { existUser } from "@/repositories/users";
import { comparePassword } from "@/utils/bcrypt";
import { generateToken } from "@/utils/jwt";

export const authService = {
  async authenticate(username: string, password: string) {
    const user = await existUser(username);
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
};
