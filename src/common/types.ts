import { ISendMailOptions } from '@nestjs-modules/mailer';

export interface ICommonResponse<T = any> {
  status: boolean;
  statusCode: number;
  message: string | string[];
  data: T | [];
  error: T | [];
}

export type OnlyMessageResponse = Promise<ICommonResponse>;

export interface ICommonMailResponse {
  accepted?: string[];
  rejected?: [];
  messageTime?: number;
  messageSize?: number;
  response?: string;
}

export interface IEmailData extends ISendMailOptions {
  email?: string;
  password?: string;
  name?: string;
  subject?: string;
  redirectUrl?: string;
}

export interface IJwtTokenPayload {
  _id: string;
  email: string;
}
