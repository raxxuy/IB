import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/" || pathname.startsWith("/auth")) {
    const token = request.cookies.get("token")?.value;
    const headers = token ? { Authorization: token } : undefined;
    const res = await fetch(`${request.nextUrl.origin}/api/auth/session`, { headers });

    if (res.status === 200) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("token")?.value;
    const headers = token ? { Authorization: token } : undefined;
    const res = await fetch(`${request.nextUrl.origin}/api/auth/session`, { headers });

    if (res.status !== 200) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  if (pathname.startsWith("/role_manager")) {
    const token = request.cookies.get("token")?.value;
    const headers = token ? { Authorization: token } : undefined;
    const res = await fetch(`${request.nextUrl.origin}/api/auth/session`, { headers });

    if (res.status !== 200) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    const user = await res.json();

    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
}
