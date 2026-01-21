export interface AxiosErrorResponse {
    message: string;
    errors?: Record<string, string[]>
}