import { Transform } from 'class-transformer';
import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';
import { TRANSLATION_LANGUAGES, type TranslationLanguage } from '../languages.js';

export class TranslateDto {
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  text: string;

  /** "auto" guesses the language from the text */
  @IsIn([...TRANSLATION_LANGUAGES, 'auto'])
  source: TranslationLanguage | 'auto';

  @IsIn(TRANSLATION_LANGUAGES)
  target: TranslationLanguage;
}
