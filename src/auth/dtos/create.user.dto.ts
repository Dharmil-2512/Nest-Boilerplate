import { IsAlpha, IsDate, IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { DateTime } from 'luxon';
import { Transform } from 'class-transformer';
import { Defaults } from '../../common/configs/default.config';
import {
  minimumLength,
  maximumLength,
  validationMessages,
  fieldRequired,
  fieldInvalid,
} from '../../common/configs/messages.config';

export class CreateUserDto {
  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @MinLength(2, { message: minimumLength('First name', 2) })
  @MaxLength(50, { message: maximumLength('First Name', 50) })
  @IsAlpha('en-US', { message: validationMessages.FIRST_NAME_IS_ALPHA })
  @IsNotEmpty()
  firstName: string;

  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @MinLength(2, { message: minimumLength('Last name', 2) })
  @MaxLength(50, { message: maximumLength('Last Name', 50) })
  @IsAlpha('en-US', { message: validationMessages.LAST_NAME_IS_ALPHA })
  @IsNotEmpty({ message: fieldRequired('Last Name') })
  lastName: string;

  @Transform(({ value }): string => (value as string).trim())
  @Matches(Defaults.PASSWORD_REGEX, {
    message: validationMessages.PASSWORD_IS_VALID,
  })
  @IsString()
  @IsNotEmpty({ message: fieldRequired('Password') })
  password: string;

  @Transform(({ value }): string => (value as string).trim().toLowerCase())
  @IsEmail({}, { message: fieldInvalid('Email') })
  @MaxLength(100, { message: maximumLength('Email', 100) })
  @IsNotEmpty({ message: fieldRequired('Email') })
  email: string;

  @IsNotEmpty({ message: fieldRequired('Date of birth') })
  @Transform(({ value }): Date => {
    return typeof value === 'string' ? DateTime.fromISO(value).toJSDate() : value;
  })
  @IsDate()
  dob: Date;
}
