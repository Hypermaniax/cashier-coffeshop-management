import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "./proxy/isAuthenticated";
import { redirectAndCheckRole } from "./proxy/redirectAndCheckRole";

export const proxy = async (req: NextRequest) => {
  // check login
  const auth = await isAuthenticated(req);
  if (auth instanceof NextResponse) return auth;
  //check role and redirect
  const checkRoleAndRedirect = await redirectAndCheckRole(req, auth.role);
  if (checkRoleAndRedirect instanceof NextResponse) return checkRoleAndRedirect;

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
