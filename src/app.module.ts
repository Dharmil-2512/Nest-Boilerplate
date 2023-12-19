import { BadRequestException, Module, ValidationError, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResponseInterceptorService } from './common/interceptors/response-interceptor.service';
import { GlobalExceptionFilter } from './common/global-exception-filter';
import { errorMessages } from './common/configs/messages.config';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptorService,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        exceptionFactory: (validationErrors: ValidationError[] = []): BadRequestException => {
          const errorKey = Object.keys(validationErrors[0].constraints)[0];
          return new BadRequestException(
            validationErrors[0].constraints[`${errorKey}`] || errorMessages.UNEXPECTED_ERROR,
          );
        },
      }),
    },
  ],
})
export class AppModule {}
