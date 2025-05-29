type APIResponse<T = any> = {
    mes: string;
    status: number;
    data: T | null;
    totalPages?: number;
    message?: string;
};

export default APIResponse;
