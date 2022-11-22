import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const allCookies = request.cookies.getAll();
  console.log("allCookies: ", allCookies);
  const refreshToken = request.cookies.get("refreshToken")?.value;
  console.log("refreshToken: ", refreshToken);
  if (
    refreshToken === undefined ||
    refreshToken === "undefined" ||
    refreshToken === ""
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/dashboard/:path*", "/portal/:path*", "/properties/:path"],
};
