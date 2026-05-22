import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHomeworkResultDto {
  @ApiProperty({ description: 'HomeworkAnswerStudent ID' })
  @Type(() => Number)
  @IsInt()
  homework_answer_id: number;

  @ApiProperty({ description: 'Ball (0-100)', example: 85 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  grade: number;

  @ApiProperty({ description: 'Izoh yoki sharh', example: 'Yaxshi bajarilgan' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Qabul qilindi (true) yoki qaytarildi (false)' })
  @IsBoolean()
  @Type(() => Boolean)
  status: boolean;
}

export class UpdateHomeworkResultDto {
  @ApiPropertyOptional({ example: 90 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  grade?: number;

  @ApiPropertyOptional({ example: 'Qayta ko\'rib chiqildi' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  status?: boolean;
}