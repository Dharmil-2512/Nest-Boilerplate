import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CommonService } from '../common/common.service';
import { Defaults } from '../common/configs/default.config';
import {
  errorMessages,
  successMessages,
} from '../common/configs/messages.config';
import { CommonMailService } from '../common/notification/mail.service';
import { OnlyMessageResponse } from '../common/types';
import { LoginResponse } from '../user/types';
import { UserService } from '../user/user.service';
import { ResponseHandler } from '../utils/response-handler';
import { CreateUserDto } from './dtos/create.user.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { UserLoginDto } from './dtos/login.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import {
  EmailVerify,
  EmailVerifyDocument,
} from './schemas/email-verify.schema';
import {
  ForgotPassword,
  ForgotPasswordDocument,
} from './schemas/forgot-password.schema';

/**
 * Description - Auth Service
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(EmailVerify.name)
    private readonly emailVerifyModel: Model<EmailVerify>,
    @InjectModel(ForgotPassword.name)
    private readonly resetPasswordTokenModel: Model<ForgotPassword>,
    private jwtService: JwtService,
    private readonly userService: UserService,
    private commonService: CommonService,
    private commonMailService: CommonMailService,
    private configService: ConfigService,
  ) {}

  /**
   * Description - User signup service
   * @param createUserDto CreateUserDto
   * @returns Common success | error response
   */
  async signup(createUserDto: CreateUserDto): OnlyMessageResponse {
    const userWithEmail = await this.userService.getUserJson({
      email: createUserDto.email,
    });

    if (userWithEmail) {
      throw new ConflictException(errorMessages.USER_ALREADY_REGISTERED);
    }

    const user = await this.userService.createUser(createUserDto);

    const emailVerificationToken = this.commonService.generateToken(12);

    await this.createEmailVerifyToken({
      userId: user._id,
      token: emailVerificationToken,
    });

    const redirectUrl = `${Defaults.EMAIL_VERIFY_URL}${emailVerificationToken}`;

    await this.commonMailService.checkEmail({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      subject: Defaults.VERIFY_USER_SUBJECT,
      redirectUrl,
    });

    return ResponseHandler.success(
      [],
      successMessages.USER_ADDED,
      HttpStatus.OK,
    );
  }

  /**
   * Description - Verify email Service
   * @param emailVerificationToken string
   * @returns Common success | error response
   */
  async verifyEmail(emailVerificationToken: string): OnlyMessageResponse {
    const idToken = await this.getEmailVerifyToken({
      token: emailVerificationToken,
    });
    if (!idToken) {
      throw new UnauthorizedException(errorMessages.VERIFICATION_LINK_EXPIRED);
    }

    await this.userService.updateUser(
      { _id: idToken.userId },
      { emailVerified: true },
    );

    await this.emailVerifyModel.deleteOne({ token: emailVerificationToken });

    return ResponseHandler.success(
      [],
      successMessages.EMAIL_VERIFIED,
      HttpStatus.OK,
    );
  }

  /**
   * Description - User login service
   * @param userLoginDto UserLoginDto
   * @returns User Details with access token
   */
  async login(loginDto: UserLoginDto): LoginResponse {
    const user = await this.userService.getUser(
      { email: loginDto.email },
      true,
    );
    if (!user) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    if (!user.emailVerified) {
      throw new NotAcceptableException(errorMessages.EMAIL_NOT_VERIFIED);
    }
    const passwordCheck = await user.validatePassword(loginDto.password);

    if (!passwordCheck) {
      throw new UnauthorizedException(errorMessages.INCORRECT_DETAILS);
    }

    const payload = {
      _id: user._id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('SECRET_KEY'),
    });

    return ResponseHandler.success(
      {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        accessToken,
      },
      successMessages.USER_LOGGED_IN,
      HttpStatus.OK,
    );
  }

  /**
   * Description - Forgot password service
   * @param forgotPasswordDto SendEmailDto
   * @returns Common success | error response
   */
  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): OnlyMessageResponse {
    const user = await this.userService.getUser({
      email: forgotPasswordDto.email,
    });
    if (!user) {
      throw new NotFoundException(errorMessages.USER_NOT_REGISTERED);
    }

    if (!user.emailVerified) {
      throw new BadRequestException(errorMessages.EMAIL_NOT_VERIFIED);
    }

    const resetPasswordToken = this.commonService.generateToken(12);

    await this.createResetPasswordToken({
      userId: user._id,
      token: resetPasswordToken,
    });

    const redirectUrl = `${Defaults.RESET_PASSWORD_URL}${resetPasswordToken}`;

    await this.commonMailService.checkEmail({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      subject: Defaults.FORGOT_PASSWORD_SUBJECT,
      redirectUrl,
    });

    return ResponseHandler.success(
      [],
      successMessages.FORGOT_PASSWORD,
      HttpStatus.OK,
    );
  }

  /**
   * Description - Reset password service
   * @param resetPasswordDto ResetPasswordDto
   * @returns Common success | error response
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): OnlyMessageResponse {
    const idToken = await this.getResetPasswordToken({
      token: resetPasswordDto.token,
    });
    if (!idToken) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    await this.userService.updateUser(
      { _id: idToken.userId },
      {
        password: await this.commonService.hashPassword(
          resetPasswordDto.password,
        ),
      },
    );

    await this.resetPasswordTokenModel.deleteOne({
      token: resetPasswordDto.token,
    });

    return ResponseHandler.success(
      [],
      successMessages.PASSWORD_RESET,
      HttpStatus.OK,
    );
  }

  /**
   * Description - Create Email Verify Token common function
   * @param idTokenData Partial<ForgotPasswordDocument>
   * @returns Email Verify Token Document
   */
  async createEmailVerifyToken(
    idTokenData: Partial<EmailVerifyDocument>,
  ): Promise<EmailVerifyDocument> {
    return this.emailVerifyModel.create(idTokenData);
  }

  /**
   * Description - Get Email Verify Token common function
   * @param query
   * @returns Email Verify Token  document
   */
  async getEmailVerifyToken(
    query: Partial<FilterQuery<EmailVerifyDocument>>,
  ): Promise<EmailVerifyDocument> {
    return this.emailVerifyModel.findOne(query);
  }

  /**
   * Description - Create Reset Password Token common function
   * @param idTokenData Partial<ForgotPasswordDocument>
   * @returns Reset Password Token Document
   */
  async createResetPasswordToken(
    idTokenData: Partial<ForgotPasswordDocument>,
  ): Promise<ForgotPasswordDocument> {
    return this.resetPasswordTokenModel.create(idTokenData);
  }

  /**
   * Description - Get Reset Password Token common function
   * @param query
   * @returns Reset Password Token  document
   */
  async getResetPasswordToken(
    query: Partial<FilterQuery<ForgotPasswordDocument>>,
  ): Promise<ForgotPasswordDocument> {
    return this.resetPasswordTokenModel.findOne(query);
  }
}
