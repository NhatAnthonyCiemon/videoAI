import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import CustomScrollbar from "@/components/ui/CustomScrollbar";
import InitToken from "./InitToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function decodeJWTPayload(token: string): any | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) {
            throw new Error("Invalid JWT format");
        }

        const payload = parts[1];

        // Chuyển từ base64url sang base64
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

        // Giải mã và chuyển từ base64 thành UTF-8 JSON string
        const decodedAscii = atob(padded);
        const decodedUtf8 = decodeURIComponent(escape(decodedAscii));

        return JSON.parse(decodedUtf8);
    } catch (error) {
        console.error("Failed to decode JWT payload:", error);
        return null;
    }
}

import { UserProvider } from "@/app/UserProvider";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "AI Short Video Creator",
    description: "Create short videos with AI",
    keywords: ["AI", "Video", "Creator"],
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    let token = cookieStore.get("access_token")?.value || "";
    //giải mã token để lấy thông tin user
    let user = null;
    try {
        if (token) {
            const decodedToken = decodeJWTPayload(token);
            user = {
                id: decodedToken.id,
                username: decodedToken.username,
                email: decodedToken.email,
                image: decodedToken.image,
            };
        }
    } catch (error) {
        console.log("Error decoding token:", error);
    }
    return (
        <html lang="en">
            <body>
                <Toaster />
                <UserProvider user={user}>
                    <InitToken token={token}>
                        <CustomScrollbar>{children}</CustomScrollbar>
                    </InitToken>
                </UserProvider>
            </body>
        </html>
    );
}
