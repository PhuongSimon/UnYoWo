import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsOptional, IsString, IsTimeZone, Matches, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { PASSWORD_MIN_LENGTH } from '../../auth/dto/auth.dto.js';
import { COLOR_THEMES, type ColorTheme } from '../color-themes.js';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);
const isPresent = (_: object, value: unknown) => value !== undefined;

/** Every field is optional: the web app sends only what changed. */
export class UpdateProfileDto {
  // Rejects control and invisible format characters (zero-width, right-to-left override) used to spoof names
  @ValidateIf(isPresent)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[^\p{Cc}\p{Cf}]+$/u)
  fullName?: string;

  /** IANA zone sent by the browser, e.g. Asia/Ho_Chi_Minh */
  @ValidateIf(isPresent)
  @IsTimeZone()
  timezone?: string;

  /** null goes back to the app default */
  @IsOptional()
  @IsIn(COLOR_THEMES)
  colorTheme?: ColorTheme | null;
}

export class ChangePasswordDto {
  /** Required once the account has a password; a Google-only account sets its first one without it. */
  @IsOptional()
  @IsString()
  @MaxLength(128)
  currentPassword?: string;

  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(128)
  newPassword: string;
}

export class DeleteAccountDto {
  /** Accounts with a password confirm with it. */
  @IsOptional()
  @IsString()
  @MaxLength(128)
  password?: string;

  /** Google-only accounts confirm by typing their email. */
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(254)
  email?: string;
}
