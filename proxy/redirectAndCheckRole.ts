import { NextRequest, NextResponse } from "next/server";

export const redirectAndCheckRole = async (req: NextRequest, role: string) => {
  const path = req.nextUrl.pathname;

  const rolePath: Record<string, string> = {
    admin: "/admin",
    cashier: "/cashier",
  };
  const targetPath = rolePath[role];        

  const isAccessingWrongPath = Object.values(rolePath).some(
    (basePath) => path.startsWith(basePath) && basePath !== targetPath,
  );

  if (isAccessingWrongPath && targetPath) {
    return NextResponse.redirect(new URL(targetPath, req.url));
  }

  return null;
};
