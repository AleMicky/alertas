import axios from 'axios';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
  errorCode?: string;
  timestamp: string;
  path?: string;
}

export function isApiResponse(value: unknown): value is ApiResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as ApiResponse;

  return (
    candidate.success === true &&
    typeof candidate.message === 'string' &&
    typeof candidate.timestamp === 'string' &&
    'data' in candidate
  );
}

export function isApiErrorResponse(value: unknown): value is ApiResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as ApiResponse;

  return (
    candidate.success === false &&
    typeof candidate.message === 'string' &&
    typeof candidate.timestamp === 'string'
  );
}

export function unwrapApiResponse<T>(payload: unknown): T {
  if (isApiResponse(payload)) {
    return payload.data as T;
  }

  return payload as T;
}

function formatApiErrors(errors: unknown): string | undefined {
  if (Array.isArray(errors)) {
    return errors.map(String).join(', ');
  }

  if (typeof errors === 'string') {
    return errors;
  }

  return undefined;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'No se pudo completar la operación.',
): string {
  if (!axios.isAxiosError(error)) {
    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  }

  const data = error.response?.data;

  if (isApiErrorResponse(data)) {
    return formatApiErrors(data.errors) ?? data.message;
  }

  if (isApiResponse(data) && !data.success) {
    return formatApiErrors(data.errors) ?? data.message;
  }

  if (typeof data === 'object' && data !== null) {
    const legacy = data as { message?: string | string[] };
    const message = legacy.message;

    if (Array.isArray(message)) {
      return message.join(', ');
    }

    if (typeof message === 'string') {
      return message;
    }
  }

  return error.message || fallback;
}
