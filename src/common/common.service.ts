import { Injectable } from '@nestjs/common';
import { DateTime, DurationLikeObject } from 'luxon';
import { Defaults } from './defult.config';

@Injectable()
export class CommonService {
  public generateToken(length: number): string {
    let result = '';
    const char = Defaults.PASSWORD_CHARS;
    for (let i = 0; i < length; i++) {
      result += char.charAt(Math.floor(Math.random() * char.length));
    }
    return result;
  }

  public getLocalDateTime(time: number | string): string | number {
    if (typeof time === 'number') {
      //if time in seconds
      if (time.toString().length === 10) {
        return DateTime.fromSeconds(time).toSeconds();
      }
      //if time in milliseconds
      return DateTime.fromMillis(time).toUTC().toISO();
    }
    //if time in iso string
    return DateTime.fromISO(time).toUTC().toISO();
  }

  /**
   * Description - Add time in current time common function
   * @param durationObject
   * @returns string value
   */
  public addTimeInCurrentTime(durationObject: DurationLikeObject): string {
    return DateTime.now().plus(durationObject).toUTC().toISO();
  }
}
