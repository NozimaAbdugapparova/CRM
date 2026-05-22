import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateCourseDto } from './dto/create.course.dto';
import { UpdateCourseDto } from './dto/update.course.dto';

@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService) {}

    async getAllCourses() {
        const courses = await this.prisma.course.findMany({
            where: { status: Status.active },
        });
        return { success: true, data: courses };
    }

    async createCourse(payload: CreateCourseDto) {
        const existCourse = await this.prisma.course.findUnique({
            where: { name: payload.name },
        });
        if (existCourse) throw new ConflictException('This course is already exist');

        await this.prisma.course.create({ data: payload });
        return { success: true, message: 'Course is created' };
    }

    async updateCourse(id: number, payload: UpdateCourseDto) {
        const existing = await this.prisma.course.findUnique({ where: { id } });
        if (!existing) throw new NotFoundException('Course not found');

        // Agar nom o'zgarayotgan bo'lsa, duplicate tekshirish
        if (payload.name && payload.name !== existing.name) {
            const nameTaken = await this.prisma.course.findUnique({
                where: { name: payload.name },
            });
            if (nameTaken) throw new ConflictException('This course name is already taken');
        }

        const updated = await this.prisma.course.update({
            where: { id },
            data: payload,
        });
        return { success: true, data: updated };
    }

    async deleteCourse(id: number) {
        const existing = await this.prisma.course.findUnique({ where: { id } });
        if (!existing) throw new NotFoundException('Course not found');

        // Soft delete — statusni inactive qilish
        await this.prisma.course.update({
            where: { id },
            data: { status: Status.inactive },
        });
        return { success: true, message: 'Course is deleted' };
    }
}