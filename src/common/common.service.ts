import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { randomInt } from 'crypto';
import { Defaults } from './configs/default.config';

@Injectable()
export class CommonService {
  /**
   * Description - Generate random string common function
   * @param length number
   * @returns random string
   */
  public generateToken(length: number): string {
    const charSet =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = randomInt(0, charSet.length);
      result += charSet.charAt(randomIndex);
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
    return `${fieldName}-${fileName}-${
      Date.now() + Math.round(randomInt(0, 100) * 100)
    }.${extension}`;
  }
}
