import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

async function handler(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const token = (await cookies()).get("access_token")?.value;

    const url = `${BACKEND_URL}/${path.join("/")}`;

    const response = await fetch(url, {
        method: request.method,
        headers: {
            Cookie: `access_token=${token}`,
            "Content-Type":
                request.headers.get("Content-Type") || "application/json",
        },
        body:
            request.method === "GET" || request.method === "HEAD"
                ? undefined
                : await request.text(),
    });

    const data = await response.text();

    return new NextResponse(data, {
        status: response.status,
        headers: {
            "Content-Type":
                response.headers.get("Content-Type") || "application/json",
        },
    });
}

export {
    handler as GET,
    handler as POST,
    handler as PUT,
    handler as PATCH,
    handler as DELETE,
};