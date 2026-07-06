//middleware (runs server side)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("access_token"); //reads cookie from incoming request
    
    const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");
    
    //if protected route and no token, redirected to login
    if (isProtectedRoute && !token) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};