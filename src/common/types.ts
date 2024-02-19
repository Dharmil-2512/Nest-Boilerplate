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

export interface IEmailData {
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

export interface IJwtTokenPayload {
  _id: string;
  email: string;
}

export interface CommonFiles {
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
  }[];
}

export interface FileData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  contentDisposition: null;
  storageClass: string;
  serverSideEncryption: null;
  metadata: any;
  location: string;
  etag: string;
  contentEncoding: null;
  versionId: undefined;
}

export interface UploadedFileData {
  file: string;
}
export type UploadFileResponse = CommonResponse<UploadedFileData>;
