"use client";
import HttpMethod from "@/types/httpMethos";
import APIResponse from "@/types/apiResponse";
import { getToken } from "../Token";
import { toast } from "sonner";

function showErrorToast(message: string) {
    toast.error(message, {
        duration: 4000,
        position: "top-center",
    });
}

async function fetchApi<T>(
    url: string,
    method: HttpMethod = HttpMethod.GET,
    body?: any
): Promise<APIResponse<T>> {
    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: body ? JSON.stringify(body) : undefined,
    };
    try {
        const response = await fetch(url, options);
        const data: APIResponse<T> = await response.json();
        if (data.mes === "Unauthorized") {
            showErrorToast("Phiên bạn đã hết hạn đăng nhập");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const req = await fetch("/api/logout", {
                method: "GET",
            }).then((res) => res.json());
            if (req.mes === "success") {
                window.location.href = "/signin";
            }
        }
        return data;
    } catch (error) {
        throw error;
    }
}

export default fetchApi;
