import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthed = !!req.auth?.user?.id;
  const role = req.auth?.user?.role;

  const isAuthPage = ["/login", "/signup", "/forgot-password", "/reset-password"].some((p) =>
    pathname.startsWith(p),
  );
  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isAdminOnly = pathname.startsWith("/admin");

  if (isAuthed && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (!isAuthed && isProtected) {
    const url = new URL("/login", req.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  if (isAdminOnly && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}) as unknown as (req: NextRequest) => NextResponse;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ],
};
