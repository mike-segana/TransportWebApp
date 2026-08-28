//middleware proxy runs before rendering to protect routes by checking for a valid access_token and user role
//request interception and auth protection
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("access_token")?.value;

    //protected pages
    const isDashboard = pathname.startsWith("/dashboard");
    const isAdmin = pathname.startsWith("/admin");

    if (!isDashboard && !isAdmin) {
        return NextResponse.next();
    }

    //redirects to login if there is no token
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        //validates jwt and gets user role
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
            {
                headers: {
                    Cookie: `access_token=${token}`,
                },
                cache: "no-store",
            }
        );

        //invalid or expired token
        if (!response.ok) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const user = await response.json();

        //admin role check to access admin portal
        if (isAdmin && user.role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }

        //user role check to access user dashboard
        if (isDashboard && user.role !== "user") {
            return NextResponse.redirect(new URL("/unauthorized", request.url)); 
        }

        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};