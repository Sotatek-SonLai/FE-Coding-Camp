import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const walletAddress = request.cookies.get("walletAddress")?.value;

  if (isNothing(accessToken)) return redirectTo("/login", request);

  const { pathname } = request.nextUrl;

  if (isNothing(walletAddress) && pathname !== "/connect-wallet") {
    return redirectTo("/connect-wallet", request);
  }

  NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/portfolio/:path*",
    "/portal/:path*",
    "/properties/:path*",
    "/connect-wallet/:path*",
  ],
};

const isNothing = (value: any) => {
  return value === undefined || value === "undefined" || value === "";
};

const redirectTo = (url: string, request: NextRequest) =>
  NextResponse.redirect(new URL(url, request.url));
