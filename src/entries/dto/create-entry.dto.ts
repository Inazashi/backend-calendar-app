import {
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEntryDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @IsNotEmpty()
  @IsDateString()
  endTime: Date;
}
