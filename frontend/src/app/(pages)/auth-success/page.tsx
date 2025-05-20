"use client";
import { useEffect } from "react";

export default function AuthSuccess() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            window.opener?.postMessage({ token }, "http://localhost:3000");
            window.close();
        }
    }, []);

    return <p>Đang xử lý đăng nhập...</p>;
}
