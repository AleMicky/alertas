export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    errors?: unknown;
    errorCode?: string;
    timestamp: string;
    path?: string;
}