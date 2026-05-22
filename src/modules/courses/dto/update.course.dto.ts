import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CourseLevel } from '@prisma/client';

export class UpdateCourseDto {
    @ApiPropertyOptional({ example: 'Machine learning' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 'Yangilangan tavsif' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 3000000 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    price?: number;

    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    duration_hours?: number;

    @ApiPropertyOptional({ example: 6 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    duration_month?: number;

    @ApiPropertyOptional({ enum: ['beginner', 'intermediate', 'advanced'] })
    @IsOptional()
    @IsEnum(['beginner', 'intermediate', 'advanced'])
    level?: CourseLevel;
}