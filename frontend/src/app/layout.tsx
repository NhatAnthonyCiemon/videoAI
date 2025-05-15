import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import InitToken from "./InitToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
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
                    <InitToken token={token}>{children}</InitToken>
                </UserProvider>
            </body>
        </html>
    );
}
