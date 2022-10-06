import { IsOptional, IsString, MinLength } from 'class-validator';

export class ClientMessageSentDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @MinLength(1)
  message: string;
}
