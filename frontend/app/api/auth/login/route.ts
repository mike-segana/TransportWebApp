//proxy setup: next.js receives login, talks to fastapi backend, then creates the cookie on correct domain

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const body = await request.text();
    
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/token`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json(data, {
            status: response.status,
        });
    }

    //fastapi returns token temporarily
    const token = data.access_token;
    const cookieStore = await cookies();

    cookieStore.set("access_token", token, {
        httpOnly: true,
        //if "production" secure is set true else its set false
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 20,
        path: "/",
    });

    return NextResponse.json({
        message: "login successful",
    });

}