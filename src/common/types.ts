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

export interface ICommonFiles {
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
  }[];
}

export interface IFileData {
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

export interface IUploadedFileData {
  file: string;
}
export type UploadFileResponse = ICommonResponse<IUploadedFileData>;

export interface ExtensionObject {
  field: string;
  extensionType: string;
  fileName?: string;
}

export enum UploadMediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export enum MediaPrefix {
  PROFILE = 'profile',
}

export const supportedImageExtensions: string[] = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.bmp',
  '.webp',
];

export interface S3UrlObject {
  resultResponse: object;
  updateDetails: object;
}