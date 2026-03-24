export interface ExtTaxErrorResponse {
    message?: string;
}

export function from(message: string): ExtTaxErrorResponse {
    return { message };
}
