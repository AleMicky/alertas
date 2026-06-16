import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode } from '../exceptions/error-codes';
import { ApiResponse } from '../responses/api-response';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Error interno del servidor';
        let errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
        let errors: unknown = undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();

            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (
                typeof exceptionResponse === 'object' &&
                exceptionResponse !== null
            ) {
                const res = exceptionResponse as {
                    message?: string | string[];
                    errorCode?: ErrorCode;
                    errors?: unknown;
                };

                message = Array.isArray(res.message)
                    ? 'Error de validación'
                    : res.message ?? message;

                errorCode = res.errorCode ?? errorCode;
                errors = res.errors ?? res.message;
            }
        }

        const body: ApiResponse = {
            success: false,
            message,
            errorCode,
            errors,
            timestamp: new Date().toISOString(),
            path: request.url,
        };

        response.status(status).json(body);
    }
}