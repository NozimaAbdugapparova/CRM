import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHomeworkAnswerDto } from './dto/homework.answer.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class HomeworkAnswerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateHomeworkAnswerDto, user: {id: number, role:Role}, filename? : string) {
    // Homework mavjudligini tekshirish
    const homework = await this.prisma.homework.findUnique({
      where: { id: dto.homework_id },
    });
    if (!homework) throw new NotFoundException('Homework topilmadi');

    // Talabaning allaqachon javob bergani tekshiriladi
    const existing = await this.prisma.homeworkAnswerStudent.findFirst({
      where: {
        homework_id: dto.homework_id,
        student_id: user.id,
      },
    });
    if (existing) throw new ForbiddenException('Siz allaqachon javob bergansiz');

    const answer = await this.prisma.homeworkAnswerStudent.create({
      data: {
        homework_id: dto.homework_id,
        student_id:  user.id,
        title:       dto.title,
        file:        filename
      },
      include: {
        students: { select: { id: true, first_name: true, last_name: true } },
        homework: { select: { id: true, title: true } },
      },
    });

    return { success: true, data: answer };
  }

  // ── Barcha javoblar ────────────────────────────────────────
  async findAll() {
    const answers = await this.prisma.homeworkAnswerStudent.findMany({
      include: {
        students: { select: { id: true, first_name: true, last_name: true, photo: true } },
        homework: { select: { id: true, title: true } },
        homeworkResults: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return { success: true, data: answers };
  }

  // ── Bitta homework uchun javoblar ─────────────────────────
  async findByHomework(homeworkId: number) {
    const homework = await this.prisma.homework.findUnique({
      where: { id: homeworkId },
    });
    if (!homework) throw new NotFoundException('Homework topilmadi');

    const answers = await this.prisma.homeworkAnswerStudent.findMany({
      where: { homework_id: homeworkId },
      include: {
        students: { select: { id: true, first_name: true, last_name: true, photo: true } },
        homeworkResults: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return { success: true, data: answers };
  }

  // ── Talabaning o'z javoblari ──────────────────────────────
  async findMyAnswers(user: any) {
    const answers = await this.prisma.homeworkAnswerStudent.findMany({
      where: { student_id: user.id },
      include: {
        homework: { select: { id: true, title: true } },
        homeworkResults: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return { success: true, data: answers };
  }

  // ── Bitta javob ───────────────────────────────────────────
  async findOne(id: number) {
    const answer = await this.prisma.homeworkAnswerStudent.findUnique({
      where: { id },
      include: {
        students: { select: { id: true, first_name: true, last_name: true, photo: true } },
        homework: { select: { id: true, title: true } },
        homeworkResults: true,
      },
    });
    if (!answer) throw new NotFoundException("Javob topilmadi");

    return { success: true, data: answer };
  }

  // ── Javobni o'chirish ─────────────────────────────────────
  async remove(id: number, user: any) {
    const answer = await this.prisma.homeworkAnswerStudent.findUnique({
      where: { id },
    });
    if (!answer) throw new NotFoundException("Javob topilmadi");

    // Faqat o'zining javobini o'chira oladi (admin bundan mustasno)
    if (user.role === "student" && answer.student_id !== user.id) {
      throw new ForbiddenException("Siz faqat o'z javobingizni o'chira olasiz");
    }

    await this.prisma.homeworkAnswerStudent.delete({ where: { id } });

    return { success: true, message: "Javob o'chirildi" };
  }
}