import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [groupCount, courseCount, studentCount, teacherCount] =
      await Promise.all([

        // Faqat active guruhlar
        this.prisma.group.count({
          where: { status: 'active' },
        }),

        // Faqat active kurslar
        this.prisma.course.count({
          where: { status: 'active' },
        }),

        // Faqat active talabalar
        this.prisma.student.count({
          where: { status: 'active' },
        }),

        // Faqat active o'qituvchilar
        this.prisma.teacher.count({
          where: { status: 'active' },
        }),

      ]);

    return {
      success: true,
      data: {
        groups:   groupCount,
        courses:  courseCount,
        students: studentCount,
        teachers: teacherCount,
      },
    };
  }
}