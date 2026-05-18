import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateLessonDto } from './dto/create.lesson.dto';
import { Role, Status } from '@prisma/client';

@Injectable()
export class LessonsService {
    constructor(private prisma: PrismaService){}

    async getAllLessons(){
        const lessons = await this.prisma.lesson.findMany({
            where:{
                status: Status.active
            }
        })
        return {
            success: true,
            data: lessons
        }
    }

    async getMyGroupLessons(
        groupId: number,
        currentUser: { id: number; role: Role }
    ) {
        // Check if group exists
        const existGroup = await this.prisma.group.findFirst({
            where: {
                id: groupId,
                status: Status.active
            }
        });

        if (!existGroup) {
            throw new NotFoundException("Group is not found by this ID");
        }

        // Get lessons once
        const lessons = await this.prisma.lesson.findMany({
            where: {
                group_id: groupId,
                status: Status.active
            },
            select: {
                id: true,
                theme: true,
                description: true,
                created_at: true
            }
        });

        // SUPERADMIN or ADMIN can access directly
        if (
            currentUser.role === Role.SUPERADMIN ||
            currentUser.role === Role.ADMIN
        ) {
            return {
                success: true,
                data: lessons
            };
        }

        // TEACHER access check
        if (currentUser.role === Role.TEACHER) {
            const existTeacherGroup = await this.prisma.group.findFirst({
                where: {
                    id: groupId,
                    teacher_id: currentUser.id,
                    status: Status.active
                }
            });

            if (!existTeacherGroup) {
                throw new ForbiddenException(
                    "You do not have access to this group"
                );
            }

            return {
                success: true,
                data: lessons
            };
        }

        // STUDENT access check
        if (currentUser.role === Role.STUDENT) {
            const existStudentGroup =
                await this.prisma.studentGroup.findFirst({
                    where: {
                        group_id: groupId,
                        student_id: currentUser.id,
                        status: Status.active
                    }
                });

            if (!existStudentGroup) {
                throw new ForbiddenException(
                    "You do not have access to this group"
                );
            }

            return {
                success: true,
                data: lessons
            };
        }

        // Fallback protection
        throw new ForbiddenException("Access denied");
    }

    async createLesson(payload: CreateLessonDto, currentUser : {id: number, role: Role}){
        const existGroup = await this.prisma.group.findFirst({
            where:{
                id: payload.group_id,
                status: Status.active
            }
        })

        if(!existGroup) {
            throw new NotFoundException("Group not found with this id")
        }

        if(currentUser.role == Role.TEACHER && existGroup.teacher_id !=currentUser.id){
            throw new ForbiddenException("It is not your group")
        }


        const lesson = await this.prisma.lesson.create({
            data:{
                ...payload,
                teacher_id: currentUser.role == Role.TEACHER ? currentUser.id : null,
                user_id: currentUser.role != Role.TEACHER ? currentUser.id : null
            }
        })

        return {
            success: true,
            message: "Lesson created"
        }
    }
}
