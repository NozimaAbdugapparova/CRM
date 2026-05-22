import { ApiPropertyOptional } from '@nestjs/swagger';
import { WeekDay } from '@prisma/client';
import { IsArray, IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateGroupDto {
    @ApiPropertyOptional({ example: 'Backend Pro Group' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 15 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    max_student?: number;

    @ApiPropertyOptional({ example: '2026-09-01' })
    @IsOptional()
    @IsDateString()
    start_date?: string;

    @ApiPropertyOptional({ example: '09:00' })
    @IsOptional()
    @IsString()
    start_time?: string;

    @ApiPropertyOptional({ example: ['monday', 'wednesday', 'friday'], enum: WeekDay, isArray: true })
    @IsOptional()
    @IsArray()
    @IsEnum(WeekDay, { each: true })
    week_day?: WeekDay[];

    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    course_id?: number;

    @ApiPropertyOptional({ example: 3 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    teacher_id?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    room_id?: number;
}