export interface CommonResponse<T = any> {
  status: boolean;
  statusCode: number;
  message: string | string[];
  data: T | [];
  error: T | [];
}

export type CommonResponsePromise = Promise<CommonResponse>;

export interface CommonMailResponse {
  accepted?: string[];
  rejected?: [];
  messageTime?: number;
  messageSize?: number;
  response?: string;
}

export interface EmailData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  userName?: string;
  subject?: string;
  text?: string;
  template?: string;
  from?: string;
  to?: string;
  html?: string | Buffer;
  redirectUrl?: string;
  data?: { receiverEmail: string };
}
