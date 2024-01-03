import { PickType } from '@nestjs/mapped-types';
import { UserLoginDto } from './login.dto';

export class ForgotPasswordDto extends PickType(UserLoginDto, ['email'] as const) {}
