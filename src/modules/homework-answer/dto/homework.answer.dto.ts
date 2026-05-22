import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateHomeworkAnswerDto {
  @ApiProperty({ example: 1, description: 'Homework ID' })
  @IsNumber()
  @Type(() => Number)
  homework_id: number;

  @ApiProperty({ description: "Javob sarlavhasi" })
  @IsString()
  title: string;
}