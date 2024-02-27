import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { Defaults } from './configs/default.config';

@Injectable()
export class CommonService {
  /**
   * Description - Generate random string common function
   * @param length number
   * @returns random string
   */
  public generateToken(length: number): string {
    let result = '';
    const char =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < length; i++) {
      result += char.charAt(Math.floor(Math.random() * char.length));
    }
    return result;
  }

  /**
   * Description - Convert plain text to hash common function
   * @param plainText string
   * @returns Hash Password
   */
  public async hashPassword(plainText: string): Promise<string> {
    const salt = await genSalt(Defaults.SALT_ROUND);
    return hash(plainText, salt);
  }

  /**
   * Description - Compare password common function
   * @param password string
   * @param userPassword string
   * @returns True | False
   */
  public async comparePassword(
    password: string,
    userPassword: string
  ): Promise<boolean> {
    return compare(userPassword, password);
  }

  /**
   * Description - Convert special character & extra spaces of filename to hyphen
   * @param fileName string
   * @returns string
   */
  public convertFileNameSpecialCharacterToHyphen(fileName: string): string {
    return fileName
      .replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '-')
      .replace(/^(-)+|(-)+$/g, '');
  }

  /**
   * Description - function to generate s3 filename
   * @param extension string
   * @param fileName string
   * @param fieldName string
   * @returns string
   */
  public generateFileName(
    extension: string,
    fileName: string,
    fieldName: string
  ): string {
    return `${fieldName}-${this.convertFileNameSpecialCharacterToHyphen(
      fileName
    )}-${Date.now() + Math.round(Math.random() * 100)}.${extension}`;
  }
}
