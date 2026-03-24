export interface ExtClockErrorResponse {
    message: string;
}

export function from(message: string): ExtClockErrorResponse {
    return { message };
}
