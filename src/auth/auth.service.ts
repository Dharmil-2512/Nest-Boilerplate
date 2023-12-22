import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dtos/create.user.dto';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { LoginResponse, UserDetailModel } from 'src/user/user.types';
import { ResponseHandler } from 'src/utils/response-handler';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

import { errorMessages, successMessages } from 'src/common/configs/messages.config';
import { CommonService } from 'src/common/common.service';
import { CommonResponsePromise } from 'src/common/common.types';
import { Defaults } from 'src/common/defult.config';
import { ResetPasswordDto } from 'src/auth/dtos/reset-password.dto';
import { CommonMailService } from 'src/common/notification/mail.service';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private commonService: CommonService,
    private commonMailService: CommonMailService,
  ) {}

  async createUser(user: User, createUserDto: CreateUserDto): UserDetailModel {
    const newPassword = this.commonService.generateToken(8);

    const addUser = {
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      password: await bcrypt.hash(newPassword, 10),
      resetPasswordToken: '',
      resetPasswordExpiryTime: '',
    };

    const createUser = await this.userModel.create(addUser);

    await this.commonMailService.checkEmail({
      firstName: createUser.firstName,
      lastName: createUser.lastName,
      email: createUser.email,
      password: newPassword,
      subject: Defaults.SEND_PASSWORD,
      redirectUrl: Defaults.LOGIN_URL,
    });
    return ResponseHandler.success(createUser, successMessages.USER_ADDED, HttpStatus.OK);
  }

  async login(loginDto: LoginDto): LoginResponse {
    const user: User = await this.userModel.findOne({ email: loginDto.email }).lean();
    if (!user) throw new NotFoundException('user not found ');

    const passwordMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Unauthorized');

    const payload = {
      _id: user._id,
      email: user.email,
    };

    return ResponseHandler.success(
      {
        _id: user._id,
        email: user.email,
        lastName: user.lastName,
        firstName: user.firstName,
        token: this.jwtService.sign(payload),
      },
      'user login successfully',
      HttpStatus.OK,
    );
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): CommonResponsePromise {
    const user = await this.userModel.findOne({ email: forgotPasswordDto.email });
    if (!user) throw new NotFoundException(errorMessages.USER_NOT_FOUND);

    let redirectUrl: string;
    const resetPasswordExpiryTime = this.commonService.addTimeInCurrentTime({ hour: Defaults.TOKEN_EXPIRY_TIME });
    const currentTime = this.commonService.getLocalDateTime(Date.now());

    if (currentTime <= user.resetPasswordExpiryTime) {
      await user.updateOne({ resetPasswordExpiryTime });
      redirectUrl = `${Defaults.REDIRECT_URL_PATH}${user.resetPasswordToken}`;
    } else {
      const resetPasswordToken = this.commonService.generateToken(8);
      await user.updateOne({ resetPasswordToken, resetPasswordExpiryTime });
      redirectUrl = `${Defaults.REDIRECT_URL_PATH}${resetPasswordToken}`;
    }

    await this.commonMailService.checkEmail({
      firstName: user.firstName,
      lastName: user.lastName,
      email: forgotPasswordDto.email,
      subject: Defaults.FORGOT_PASSWORD_SUBJECT,
      redirectUrl,
    });

    return ResponseHandler.success({}, successMessages.FORGOT_PASSWORD, HttpStatus.OK);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): CommonResponsePromise {
    const user = await this.userModel
      .findOne({ resetPasswordToken: resetPasswordDto.resetPasswordToken })
      .select('+password');
    if (!user) throw new NotFoundException(errorMessages.USER_NOT_FOUND);

    const currentTime = this.commonService.getLocalDateTime(Date.now());
    if (currentTime > user.resetPasswordExpiryTime) {
      throw new UnauthorizedException(errorMessages.RESET_TOKEN_EXPIRED);
    }

    await user.updateOne({
      password: await bcrypt.hash(resetPasswordDto.password, 10),
      resetPasswordToken: '',
      resetPasswordExpiryTime: '',
    });

    return ResponseHandler.success({}, successMessages.PASSWORD_RESET, HttpStatus.OK);
  }
}
