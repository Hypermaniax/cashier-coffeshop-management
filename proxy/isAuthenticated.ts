import { validateToken } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

export const isAuthenticated = async (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  if (path === "/login") {
    if (token) {
      return NextResponse.redirect(new URL("/cashier", req.url));
    }
    return NextResponse.next();
  }
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    const verifyToken = validateToken(token);
    return verifyToken;
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
};
