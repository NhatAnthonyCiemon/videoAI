const createResponse = (status, message, data) => {
    return {
        status,
        mes: message,
        data: data,
    };
};

const createErrorResponse = (status, message) => {
    return {
        status,
        mes: message,
        data: null,
    };
};

export { createResponse, createErrorResponse };
