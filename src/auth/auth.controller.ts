import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { OnlyMessageResponse } from '../common/common.types';
import { VerifyEmailDto } from './dtos/email-verify.dto';
import { UserLoginDto } from './dtos/login.dto';
import { CreateUserDto } from './dtos/create.user.dto';
import { LoginResponse } from '../user/user.types';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Description - User signup API
   * @param createUserDto CreateUserDto
   * @returns Common success | error response
   */
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): OnlyMessageResponse {
    return this.authService.signup(createUserDto);
  }

  /**
   * Description - Verify email API
   * @param requestToken string
   * @returns Common success | error response
   */
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): OnlyMessageResponse {
    return this.authService.verifyEmail(verifyEmailDto.token);
  }

  /**
   * Description - User login API
   * @param userLoginDto UserLoginDto
   * @returns User Details with access token
   */
  @Post('login')
  async login(@Body() loginDto: UserLoginDto): LoginResponse {
    return this.authService.login(loginDto);
  }

  /**
   * Description - Forgot password API
   * @param forgotPasswordDto SendEmailDto
   * @returns Common success | error response
   */
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): OnlyMessageResponse {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  /**
   * Description - Reset password API
   * @param resetPasswordDto ResetPasswordDto
   * @returns Common success | error response
   */
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): OnlyMessageResponse {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
