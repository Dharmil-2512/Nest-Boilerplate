import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { renderFile } from 'ejs';
import { join } from 'path';
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
   * Description - Send email common function
   * @param emailData
   * @returns Common mail response
   */
  async sendEmailWithTemplate(
    emailData: IEmailData,
    templateName: string
  ): Promise<ICommonMailResponse> {
    const ejsPath = join(__dirname, `./templates/${templateName}.ejs`);
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

    return this.mailerService.sendMail({
      from: this.configService.get<string>('EMAIL_FROM'),
      ...sendEmailData,
    }) as Promise<ICommonMailResponse>;
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
