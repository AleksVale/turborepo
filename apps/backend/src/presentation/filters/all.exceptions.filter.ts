import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private static readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const isRouteNotFound =
      status === 404 &&
      exception instanceof HttpException &&
      (exception.message.includes('Cannot GET') ||
        exception.message.includes('Cannot POST') ||
        exception.message.includes('Cannot PUT') ||
        exception.message.includes('Cannot PATCH') ||
        exception.message.includes('Cannot DELETE'));

    if (!isRouteNotFound) {
      AllExceptionsFilter.logger.error(
        'An exception occurred',
        exception instanceof Error ? exception.stack : String(exception)
      );
    }

    let message = 'Erro interno do servidor';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as { message: string }).message || message;
    }

    const servicePath = request.url.split('/').filter(Boolean).join('.');

    response.status(status).json({
      code: status,
      message,
      eventDate: new Date().toISOString(),
      service: servicePath,
    });
  }
}
