import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { token, user, remember } = body;

    const response = NextResponse.json({
        mes: "success",
        data: {
            token,
            user,
            remember,
        },
        status: 200,
    });

    response.cookies.set("access_token", token, {
        httpOnly: true,
        path: "/",
        maxAge: remember ? 60 * 60 * 24 * 30 : undefined,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return response;
}
