//middleware proxy runs before rendering to protect routes by checking for a valid access_token and user role
//request interception and auth protection
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const auth = request.headers.get("authorization");
    if (!auth?.startsWith("Basic ")) {
        return new NextResponse("Authentication required", {
            status: 401,
            headers: {
                "WWW-Authenticate": 'Basic realm="TransitFlow"',
            },
        });
    }

    const encoded = auth.split(" ")[1];

    let username = "";
    let password = "";

    try {
        const decoded = atob(encoded);
        [username, password] = decoded.split(":");
    } catch {
        return new NextResponse("Invalid authentication", {
            status: 401,
        });
    }

    if (
        username !== process.env.SITE_USERNAME || password !== process.env.SITE_PASSWORD
    ) {
        return new NextResponse("Invalid credentials", {
            status: 401,
            headers: {
                "WWW-Authenticate": 'Basic realm="TransitFlow"',
            },
        });
    }

    ///
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

//export const config = {
//    matcher: ["/dashboard/:path*", "/admin/:path*"],
//};

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};