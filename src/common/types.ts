export interface CommonResponse<T = any> {
  status: boolean;
  statusCode: number;
  message: string | string[];
  data: T | [];
  error: T | [];
}

export type OnlyMessageResponse = Promise<CommonResponse>;

export interface CommonMailResponse {
  accepted?: string[];
  rejected?: [];
  messageTime?: number;
  messageSize?: number;
  response?: string;
}

export interface EmailData {
  email?: string;
  password?: string;
  name?: string;
  subject?: string;
  template?: string | Buffer;
  from?: string;
  to?: string;
  html?: string | Buffer;
  redirectUrl?: string;
}

export interface JwtTokenPayload {
  _id: string;
  email: string;
}
