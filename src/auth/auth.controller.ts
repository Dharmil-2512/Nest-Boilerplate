import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/auth/dtos/create.user.dto';
import { LoginResponse, UserDetailModel } from 'src/user/user.types';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { CommonResponsePromise } from 'src/common/common.types';
import { ResetPasswordDto } from 'src/auth/dtos/reset-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): UserDetailModel {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): LoginResponse {
    return this.authService.login(loginDto);
  }

  @Post('forgotPassword')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): CommonResponsePromise {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('resetPassword')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): CommonResponsePromise {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
