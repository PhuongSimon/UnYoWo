import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsTimeZone, Length, Matches, MaxLength, MinLength } from 'class-validator';
import { OtpPurpose } from '../entities/otp-code.entity.js';

const normalizeEmail = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export const PASSWORD_MIN_LENGTH = 8;

class EmailDto {
  @Transform(normalizeEmail)
  @IsEmail()
  @MaxLength(254)
  email: string;
}

export class RegisterDto extends EmailDto {
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(128)
  password: string;

  @IsString()
  @IsNotEmpty()
  captchaToken: string;
}

export class LoginDto extends EmailDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  password: string;

  @IsString()
  @IsNotEmpty()
  captchaToken: string;
}

export class ForgotPasswordDto extends EmailDto {}

export class SendOtpDto extends EmailDto {
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;
}

export class VerifyOtpDto extends SendOtpDto {
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/)
  code: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  resetToken: string;

  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(128)
  password: string;
}

export class UpdateProfileDto {
  /** IANA zone sent by the browser, e.g. Asia/Ho_Chi_Minh */
  @IsTimeZone()
  timezone: string;
}
