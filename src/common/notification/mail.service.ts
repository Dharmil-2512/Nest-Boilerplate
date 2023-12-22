import { BadRequestException, Injectable } from '@nestjs/common';
import { join } from 'path';

import { Defaults } from '../defult.config';
import { CommonMailResponse, EmailData } from '../common.types';
import { MailerService } from '@nestjs-modules/mailer';
import { errorMessages } from '../configs/messages.config';
import ejs from 'ejs';

/**
 *  Common Mail Service
 */
@Injectable()
export class CommonMailService {
  /**
   * Mail Service Dependency
   * @param mailerService
   */
  constructor(private mailerService: MailerService) {}

  /**
   * Check specific email common function
   * @param emailData
   * @returns Common Mail response
   */
  async checkEmail(emailData: EmailData): Promise<CommonMailResponse> {
    switch (emailData.subject) {
      case Defaults.FORGOT_PASSWORD_SUBJECT:
        return this.sendResetPasswordEmail(emailData);
      case Defaults.SEND_PASSWORD:
        return this.sendPasswordEmail(emailData);
      default:
        throw new BadRequestException({ message: errorMessages.INVALID_SUBJECT });
    }
  }

  /**
   * Send password email function
   * @param emailData
   * @returns
   */

  async sendPasswordEmail(emailData: EmailData): Promise<CommonMailResponse> {
    const ejsPath = join(__dirname, '../notification/templates/send-password.ejs');

    const template = await ejs.renderFile(ejsPath, {
      email: emailData.email,
      firstName: emailData.firstName,
      lastName: emailData.lastName,
      password: emailData.password,
      redirectUrl: emailData.redirectUrl,
    });

    const sendEmailData = {
      email: emailData.email,
      subject: emailData.subject,
      template: template,
    };
    try {
      const email = this.sendEmail(sendEmailData);
      return email;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Send reset password email function
   * @param emailData
   * @returns
   */
  async sendResetPasswordEmail(emailData: EmailData): Promise<CommonMailResponse> {
    const ejsPath = join(__dirname, '../notification/templates/forgot-password.ejs');

    const template = await ejs.renderFile(ejsPath, {
      email: emailData.email,
      firstName: emailData.firstName,
      lastName: emailData.lastName,
      password: emailData.password,
      redirectUrl: emailData.redirectUrl,
    });
    const sendEmailData = {
      email: emailData.email,
      subject: emailData.subject,
      template: template,
    };
    try {
      const email = this.sendEmail(sendEmailData);
      return email;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Send Email function
   * @param sendEmailData
   * @returns Common mail response
   */
  sendEmail(sendEmailData: EmailData): CommonMailResponse {
    return this.mailerService.sendMail({
      from: process.env.EMAIL_FROM,
      to: sendEmailData.email,
      subject: sendEmailData.subject,
      html: sendEmailData.template,
    }) as CommonMailResponse;
  }
}
