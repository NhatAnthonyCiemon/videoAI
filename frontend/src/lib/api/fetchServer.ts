import HttpMethod from "@/types/httpMethos";
import APIResponse from "@/types/apiResponse";
import { redirect } from "next/navigation";
async function fetchApi<T>(
    url: string,
    method: HttpMethod = HttpMethod.GET,
    token: string = "",
    body?: any
): Promise<APIResponse<T>> {
    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
    };
    try {
        const response = await fetch(url, options);
        const data: APIResponse<T> = await response.json();
        if (data.mes === "Unauthorized") {
            throw new Error("Unauthorized");
        }
        return data;
    } catch (error) {
        throw error;
    }
}

export default fetchApi;
