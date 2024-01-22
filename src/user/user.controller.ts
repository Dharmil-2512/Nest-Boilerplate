import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';

/**
 * Description - User Controller
 */
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  @Get()
  getUser(): string {
    return 'abcd';
  }
}
