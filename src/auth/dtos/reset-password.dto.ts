import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { LoginDto } from './login.dto';

export class ResetPasswordDto extends PickType(LoginDto, ['password'] as const) {
  @IsNotEmpty()
  @IsString()
  resetPasswordToken?: string;
}
