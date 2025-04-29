import HttpMethod from "@/types/httpMethos";
import APIResponse from "@/types/apiResponse";

async function fetchApi<T>(
    url: string,
    method: HttpMethod = HttpMethod.GET,
    body?: any
): Promise<APIResponse<T>> {
    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
    };
    try {
        const response = await fetch(url, options);
        const data: APIResponse<T> = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export default fetchApi;
