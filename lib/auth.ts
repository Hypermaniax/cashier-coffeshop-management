import { cookies } from "next/headers";
import { validateToken } from "@/utils/jwt";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    return validateToken(token);
  } catch (error) {
    return null;
  }
}

export async function requireAuth(role?: "ADMIN" | "CASHIER") {

  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  console.log(session.role)
  if (role && session.role.toLocaleUpperCase() !== role) {
    // Admin can access everything
    if (session.role === "ADMIN") return session;
    throw new Error("Forbidden");
  }
  
  return session;
}
