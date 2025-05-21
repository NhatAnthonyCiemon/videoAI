import { NextResponse, type NextRequest } from "next/server";
function parseJwt(token: string) {
    try {
        const base64Payload = token.split(".")[1];
        const payload = Buffer.from(base64Payload, "base64").toString();
        return JSON.parse(payload);
    } catch {
        return null;
    }
}
export function middleware(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;
    console.log("Token:", token);
    const { pathname } = req.nextUrl;
    const isProtectedPath =
        pathname.startsWith("/create") || pathname.startsWith("/dashboard");

    const authPages = ["/signin", "/signup"];

    // Nếu user đã đăng nhập mà vào trang signin/signup thì redirect về trang chính
    if (authPages.includes(pathname) && token) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Nếu user chưa đăng nhập mà vào trang cần bảo vệ thì redirect về signin
    if (isProtectedPath && !token) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/create/:path*", "/dashboard/:path*", "/signin", "/signup"],
};
