import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  if (
    (token && url.pathname.startsWith("/sign-in")) ||
    url.pathname.startsWith("/verify") ||
    url.pathname.startsWith("/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.redirect(new URL("/home", request.url));
}

export const config = {
  mather: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};
