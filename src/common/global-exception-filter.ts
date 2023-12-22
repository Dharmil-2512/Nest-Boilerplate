import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ResponseHandler } from '../utils/response-handler';

/**
 * Global Exception Filter
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor() {}

  /**
   * Description - Catch Exception And Return Common Error Response
   * @param exception
   * @param host
   * @returns
   */
  catch(exception: Error, host: ArgumentsHost): Response {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      return response.status(statusCode).json(ResponseHandler.error(exception.name, exception.message, statusCode));
    }
    return response
      .status(HttpStatus.BAD_REQUEST)
      .json(ResponseHandler.error(exception.name, exception.message, HttpStatus.BAD_REQUEST));
  }
}
