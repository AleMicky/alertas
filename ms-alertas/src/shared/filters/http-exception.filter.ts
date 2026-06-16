import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode } from '../exceptions/error-codes';
import { ApiResponse } from '../responses/api-response';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const isProduction = process.env.NODE_ENV === 'production';

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
        } else if (exception instanceof Error) {
            errors = isProduction
                ? undefined
                : {
                      name: exception.name,
                      message: exception.message,
                      stack: exception.stack,
                  };
        } else {
            errors = isProduction ? undefined : { exception };
        }

        const logStack = exception instanceof Error ? exception.stack : undefined;
        this.logger.error(
            `[${request.method}] ${request.url} -> ${status} (${errorCode}) ${message}`,
            logStack,
        );

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