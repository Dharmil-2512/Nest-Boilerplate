import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailVerify, emailVerifySchema } from './schemas/email-verify.schema';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { ForgotPassword, forgotPasswordSchema } from './schemas/forgot-password.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: EmailVerify.name,
        useFactory: (): Schema<EmailVerify> => emailVerifySchema,
      },
      {
        name: ForgotPassword.name,
        useFactory: (): Schema<ForgotPassword> => forgotPasswordSchema,
      },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: configService.get<string>('TOKEN_EXPIRATION') },
      }),
    }),
    UserModule,
    CommonModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
