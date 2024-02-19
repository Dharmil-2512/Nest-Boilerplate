import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { S3Service } from '../common/services/s3.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailVerify, emailVerifySchema } from './schemas/email-verify.schema';
import {
  ForgotPassword,
  forgotPasswordSchema,
} from './schemas/forgot-password.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailVerify.name, schema: emailVerifySchema },
      { name: ForgotPassword.name, schema: forgotPasswordSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, S3Service],
})
export class AuthModule {}
