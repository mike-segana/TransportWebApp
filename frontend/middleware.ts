//middleware runs before rendering to protect routes by checking for access_token
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    if (
        request.nextUrl.pathname.startsWith("/dashboard") &&
        !request.cookies.get("access_token")
    ) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};