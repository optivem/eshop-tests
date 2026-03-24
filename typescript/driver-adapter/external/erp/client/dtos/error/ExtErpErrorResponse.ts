export interface ExtErpErrorResponse {
    message?: string;
}

export function from(message: string): ExtErpErrorResponse {
    return { message };
}
