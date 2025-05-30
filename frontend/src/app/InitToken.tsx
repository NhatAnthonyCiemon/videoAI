"use client";

import { setToken } from "@/lib/Token"; // đường dẫn đến file bạn tạo
import { useEffect } from "react";

export default function InitToken({
    token,
    children,
}: {
    token: string;
    children: React.ReactNode;
}) {
    setToken(token);
    return <div>{children}</div>;
}
