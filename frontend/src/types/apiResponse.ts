type APIResponse<T = any> = {
    mes: string;
    status: number;
    data: T | null;
};

export default APIResponse;
