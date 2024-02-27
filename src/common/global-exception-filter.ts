import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ResponseHandler } from '../utils/response-handler';

/**
 * Global Exception Filter
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  /**
   * Description - Global Exception Filter Dependencies
   * @param logger
   */
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}

  /**
   * Description - Catch Exception And Return Common Error Response
   * @param exception
   * @param host
   * @returns
   */
  catch(exception: Error, host: ArgumentsHost): Response {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    this.logger.error(
      `Error: method: ${request.method} - url :${request.url} - error : ${exception.stack}`
    );
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      return response
        .status(statusCode)
        .json(
          ResponseHandler.error(exception.name, exception.message, statusCode)
        );
    }
    return response
      .status(HttpStatus.BAD_REQUEST)
      .json(
        ResponseHandler.error(
          exception.name,
          exception.message,
          HttpStatus.BAD_REQUEST
        )
      );
  }
}
