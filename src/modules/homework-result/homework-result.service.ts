import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateHomeworkResultDto, UpdateHomeworkResultDto } from './dto/homework-result.dto';

@Injectable()
export class HomeworkResultService {
  constructor(private readonly prisma: PrismaService) {}

  /* ── CREATE ── */
  async create(dto: CreateHomeworkResultDto, user: any) {
    // HomeworkAnswer mavjudligini tekshirish
    const answer = await this.prisma.homeworkAnswerStudent.findUnique({
      where: { id: dto.homework_answer_id },
    });
    if (!answer) {
      throw new NotFoundException('HomeworkAnswer topilmadi');
    }

    // Allaqachon natija bormi?
    const existing = await this.prisma.homeworkResult.findFirst({
      where: { homework_answer_id: dto.homework_answer_id },
    });
    if (existing) {
      // Update qilib qaytaramiz (qayta baholash)
      return this.prisma.homeworkResult.update({
        where: { id: existing.id },
        data: {
          grade:   dto.grade,
          title:   dto.title,
          status:  dto.status,
          teacher_id: user?.teacher_id ?? null,
          user_id:    user?.id         ?? null,
        },
        include: { homeworkAnswerStudent: { include: { students: true } } },
      });
    }

    return this.prisma.homeworkResult.create({
      data: {
        homework_answer_id: dto.homework_answer_id,
        grade:              dto.grade,
        title:              dto.title,
        status:             dto.status,
        teacher_id:         user?.teacher_id ?? null,
        user_id:            user?.id         ?? null,
      },
      include: {
        homeworkAnswerStudent: {
          include: { students: true, homework: true },
        },
        teachers: { select: { id: true, first_name: true, last_name: true } },
      },
    });
  }

  /* ── FIND ALL ── */
  async findAll() {
    const data = await this.prisma.homeworkResult.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        homeworkAnswerStudent: {
          include: {
            students: { select: { id: true, first_name: true, last_name: true, photo: true } },
            homework: { select: { id: true, title: true } },
          },
        },
        teachers: { select: { id: true, first_name: true, last_name: true } },
      },
    });
    return { success: true, data };
  }

  /* ── FIND BY HOMEWORK ── */
  async findByHomework(homeworkId: number) {
    // Shu homeworkga tegishli barcha answerlarning resultlarini olish
    const data = await this.prisma.homeworkResult.findMany({
      where: {
        homeworkAnswerStudent: { homework_id: homeworkId },
      },
      orderBy: { created_at: 'desc' },
      include: {
        homeworkAnswerStudent: {
          include: {
            students: { select: { id: true, first_name: true, last_name: true, photo: true } },
            homework: { select: { id: true, title: true } },
          },
        },
        teachers: { select: { id: true, first_name: true, last_name: true } },
      },
    });
    return { success: true, data };
  }

  /* ── FIND ONE ── */
  async findOne(id: number) {
    const data = await this.prisma.homeworkResult.findUnique({
      where: { id },
      include: {
        homeworkAnswerStudent: {
          include: {
            students: { select: { id: true, first_name: true, last_name: true, photo: true } },
            homework: { select: { id: true, title: true } },
          },
        },
        teachers: { select: { id: true, first_name: true, last_name: true } },
      },
    });
    if (!data) throw new NotFoundException('HomeworkResult topilmadi');
    return { success: true, data };
  }

  /* ── FIND BY ANSWER ID ── */
  async findByAnswerId(answerId: number) {
    const data = await this.prisma.homeworkResult.findFirst({
      where: { homework_answer_id: answerId },
      include: {
        homeworkAnswerStudent: {
          include: {
            students: { select: { id: true, first_name: true, last_name: true } },
            homework: { select: { id: true, title: true } },
          },
        },
        teachers: { select: { id: true, first_name: true, last_name: true } },
      },
    });
    return { success: true, data: data ?? null };
  }

  /* ── UPDATE ── */
  async update(id: number, dto: UpdateHomeworkResultDto, user: any) {
    const existing = await this.prisma.homeworkResult.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('HomeworkResult topilmadi');

    const data = await this.prisma.homeworkResult.update({
      where: { id },
      data: {
        ...(dto.grade  !== undefined && { grade:  dto.grade  }),
        ...(dto.title  !== undefined && { title:  dto.title  }),
        ...(dto.status !== undefined && { status: dto.status }),
        teacher_id: user?.teacher_id ?? existing.teacher_id,
        user_id:    user?.id         ?? existing.user_id,
      },
      include: {
        homeworkAnswerStudent: {
          include: {
            students: { select: { id: true, first_name: true, last_name: true } },
            homework: { select: { id: true, title: true } },
          },
        },
      },
    });
    return { success: true, data };
  }

  /* ── DELETE ── */
  async remove(id: number) {
    const existing = await this.prisma.homeworkResult.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('HomeworkResult topilmadi');

    await this.prisma.homeworkResult.delete({ where: { id } });
    return { success: true, message: "HomeworkResult o'chirildi" };
  }
}