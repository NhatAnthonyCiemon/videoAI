// Server Action hoặc API Route
import { NextResponse } from "next/server";

export async function GET() {
    const response = NextResponse.json({
        mes: "success",
        data: null,
        status: 200,
    });
    response.cookies.set("access_token", "", {
        path: "/",
        expires: new Date(0),
    });
    return response;
}
