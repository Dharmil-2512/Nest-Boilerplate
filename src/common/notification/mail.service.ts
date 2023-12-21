import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { renderFile } from 'ejs';
import { join } from 'path';
import { Defaults } from '../configs/default.config';
import { errorMessages } from '../configs/messages.config';
import { ICommonMailResponse, IEmailData } from '../types';
/**
 *  Common Mail Service
 */
@Injectable()
export class CommonMailService {
  /**
   * Mail Service Dependency
   * @param mailerService
   */
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService
  ) {}

  /**
   * Check specific email common function
   * @param emailData
   * @returns Common Mail response
   */
  async checkEmail(emailData: IEmailData): Promise<void> {
    switch (emailData.subject) {
      case Defaults.FORGOT_PASSWORD_SUBJECT:
        await this.sendResetPasswordEmail(emailData);
        break;
      case Defaults.VERIFY_USER_SUBJECT:
        await this.sendVerificationEmail(emailData);
        break;
      default:
        throw new BadRequestException({
          message: errorMessages.INVALID_SUBJECT,
        });
    }
  }
  /**
   * Description - Send reset password email function
   * @param emailData
   * @returns Common mail response
   */
  async sendResetPasswordEmail(
    emailData: IEmailData
  ): Promise<ICommonMailResponse> {
    const ejsPath = join(__dirname, './templates/forgot-password.ejs');
    const template = await renderFile(ejsPath, {
      name: emailData.name,
      email: emailData.email,
      redirectUrl: emailData.redirectUrl,
    });
    const sendEmailData = {
      email: emailData.email,
      subject: emailData.subject,
      template: template,
    };
    try {
      const email = await this.sendEmail(sendEmailData);
      return email;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Description - Send verification email function
   * @param emailData
   * @returns Common mail response
   */
  async sendVerificationEmail(
    emailData: IEmailData
  ): Promise<ICommonMailResponse> {
    const ejsPath = join(__dirname, './templates/verify-user.ejs');
    const template = await renderFile(ejsPath, {
      name: emailData.name,
      email: emailData.email,
      redirectUrl: emailData.redirectUrl,
    });

    const sendEmailData = {
      to: emailData.email,
      subject: emailData.subject,
      html: template,
    };

    try {
      const email = await this.sendEmail(sendEmailData);
      return email;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Description - Send Email function
   * @param sendEmailData
   * @returns Common mail response
   */
  async sendEmail(sendEmailData: IEmailData): Promise<ICommonMailResponse> {
    return this.mailerService.sendMail({
      from: this.configService.get<string>('EMAIL_FROM'),
      ...sendEmailData,
    }) as Promise<ICommonMailResponse>;
  }
}
