import { MailerModule } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Module,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { errorMessages } from './common/configs/messages.config';
import { GlobalExceptionFilter } from './common/global-exception-filter';
import { ResponseInterceptorService } from './common/interceptors/response-interceptor.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('TOKEN_EXPIRATION'),
        },
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<string>('SMTP_PORT'),
          auth: {
            user: configService.get<string>('SMTP_USERNAME'),
            pass: configService.get<string>('SMTP_PASSWORD'),
          },
        },
      }),
    }),
    AuthModule,
    UserModule,
    CommonModule,
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
  ],
})
export class AppModule {}
