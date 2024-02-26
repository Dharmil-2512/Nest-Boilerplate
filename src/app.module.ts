import {
  BadRequestException,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';
import { winstonOptions } from './common/configs/logger.config';
import { errorMessages } from './common/configs/messages.config';
import { GlobalExceptionFilter } from './common/global-exception-filter';
import { ResponseInterceptorService } from './common/interceptors/response-interceptor.service';
import { LogCleanerService } from './common/services/cron.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [
    WinstonModule.forRootAsync({ useFactory: () => winstonOptions() }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
  ],
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
        exceptionFactory: (
          validationErrors: ValidationError[] = []
        ): BadRequestException => {
          const errorKey = Object.keys(validationErrors[0].constraints)[0];
          return new BadRequestException(
            validationErrors[0].constraints[`${errorKey}`] ||
              errorMessages.UNEXPECTED_ERROR
          );
        },
      }),
    },
    LogCleanerService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
