import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailVerify, emailVerifySchema } from './schemas/email-verify.schema';
import {
  ForgotPassword,
  forgotPasswordSchema,
} from './schemas/forgot-password.schema';

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
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
