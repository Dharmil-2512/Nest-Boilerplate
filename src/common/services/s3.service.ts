import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';
import { ResponseHandler } from '../../utils/response-handler';
import { CommonService } from '../common.service';
import { successMessages } from '../configs/messages.config';
import { ICommonFiles, UploadFileResponse } from '../types';

@Injectable()
export class S3Service implements OnModuleInit {
  public s3: S3Client;
  public s3BucketName: string;
  public s3Url: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly commonService: CommonService
  ) { }
  onModuleInit(): void {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
      },
    });
    this.s3BucketName = this.configService.get<string>('S3_BUCKET_NAME');
    this.s3Url = this.configService.get<string>('S3_URL');
  }

  /**
   * Description - Service to upload the file
   * @param file FileType
   * @returns UploadFileResponse
   */
  async uploadFile(file: ICommonFiles): Promise<UploadFileResponse> {
    const fileUrl = await this.uploadFilesToS3(file);
    return ResponseHandler.success(
      {
        file: fileUrl,
      },
      successMessages.IMAGE_UPLOADED,
      HttpStatus.OK
    );
  }

  /**
   *
   * @param file
   * @returns
   */
  async uploadFilesToS3(file: ICommonFiles): Promise<string> {
    const files = file.file[0];
    const randomId = this.commonService.generateToken(4);
    const extension = extname(files.originalname.toLowerCase()).substring(1);
    const fullPath = `test/files/${Date.now().toString()}_${randomId}.${extension}`;
    const uploadObj = new PutObjectCommand({
      Bucket: this.s3BucketName,
      Body: files.buffer,
      Key: fullPath,
      ContentType: files.mimetype,
    });
    await this.s3.send(uploadObj);
    return `${this.s3Url}/${fullPath}`;
  }

  /**
   *
   * @param key
   * @returns
   */
  async deleteFilesFromS3(key: string): Promise<any> {
    const deleteObj = new DeleteObjectCommand({
      Bucket: this.s3BucketName,
      Key: key,
    });
    const deleteResult = await this.s3.send(deleteObj);
    return deleteResult;
  }
}
