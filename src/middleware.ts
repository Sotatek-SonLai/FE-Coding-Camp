import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const allCookies = request.cookies.getAll();
  console.log("allCookies: ", allCookies);
  const refreshToken = request.cookies.get("refreshToken")?.value;
  console.log("refreshToken: ", refreshToken);
  if (refreshToken === "undefined") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.redirect(new URL("/dashboard", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/",
};
