type APIResponse<T = any> = {
    mes: string;
    status: number;
    data: T;
};

export default APIResponse;
