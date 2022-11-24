import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const walletAddress = request.cookies.get("walletAddress")?.value;
  console.log({ refreshToken, walletAddress });

  if (isNothing(refreshToken)) return redirectTo("/login", request);

  if (isNothing(walletAddress)) return redirectTo("/connect-wallet", request);

  // const { pathname } = request.nextUrl;
  // return pathname === "/"
  //   ? redirectTo("/", request)
  //   : NextResponse.next();
  // NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/portfolio/:path*",
    "/portal/:path*",
    "/properties/:path",
    "/connect-wallet/:path",
  ],
};

const isNothing = (value: any) => {
  return value === undefined || value === "undefined" || value === "";
};

const redirectTo = (url: string, request: NextRequest) =>
  NextResponse.redirect(new URL(url, request.url));
