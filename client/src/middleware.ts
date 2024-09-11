import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  //pathname : /manage/dashboard
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  console.log(privatePaths.some((path) => pathname.startsWith(path)));

  //Chua login ko cho vao private paths

  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Dang nhap roi thi se khong cho login nua
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Dang nhap roi nhung accessToken het han
  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    refreshToken &&
    !accessToken
  ) {
    const url = new URL("/logout", request.url);
    url.searchParams.set("refreshToken", refreshToken ?? "");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/manage/:path*", "/login"],
};
