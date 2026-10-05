import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Matches, Max, MaxLength, Min, ValidateIf } from 'class-validator';
import { GameType, ReviewRating, SessionSource } from '../../../generated/prisma/enums.js';

export class CreateGameSessionDto {
  @IsEnum(GameType)
  gameType: GameType;

  @IsString()
  @Matches(/^[a-z]{2,3}$/)
  language: string;

  @IsEnum(SessionSource)
  source: SessionSource;

  @ValidateIf((dto: CreateGameSessionDto) => dto.source === SessionSource.SET)
  @IsUUID()
  setId?: string;
}

/** Only the user's choice is sent: correctness, score and XP are decided by the server. */
export class SubmitAnswerDto {
  @IsUUID()
  questionId: string;

  /** New UUID per answer; resending the same one returns the first result. */
  @IsUUID()
  idempotencyKey: string;

  /** Multiple choice */
  @IsOptional()
  @IsString()
  @MaxLength(16)
  optionId?: string;

  /** Flashcards */
  @IsOptional()
  @IsEnum(ReviewRating)
  rating?: ReviewRating;

  /** Typing; an empty string means "I don't know" */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  text?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(600_000)
  responseMs?: number;
}
