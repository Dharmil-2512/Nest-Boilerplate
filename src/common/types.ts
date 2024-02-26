export interface ICommonResponse<T = any> {
  status: boolean;
  statusCode: number;
  message: string | string[];
  data: T | [];
  error: T | [];
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

export interface IUploadedFileData {
  file: string;
}

export type UploadFileResponse = ICommonResponse<IUploadedFileData>;
