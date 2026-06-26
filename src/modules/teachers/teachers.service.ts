import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateTeacherDto } from './dto/create.dto';
import * as bcyrpt from 'bcrypt';
import { Status } from '@prisma/client';
import { updateTeacherDto } from './dto/update.teacher.dto';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async getAllTeachers() {
    const teachers = await this.prisma.teacher.findMany({
      where: {
        status: Status.active,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone: true,
        photo: true,
        email: true,
        address: true,
      },
    });
    return {
      success: true,
      data: teachers,
    };
  }

  async getAllInactiveTeachers() {
    const teachers = await this.prisma.teacher.findMany({
      where: {
        OR: [{ status: Status.inactive }, { status: Status.freeze }],
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone: true,
        photo: true,
        email: true,
        address: true,
      },
    });
    return {
      success: true,
      data: teachers,
    };
  }

  async getAllgroups(id:number){
      const groups = await this.prisma.group.findMany({
          where:{teacher_id: id},
          include:{
              courses: true,
              rooms: true,
              studentGroups: true
          }
      })

      if(!groups.length) throw new NotFoundException("This teacher has not any groups yet")

      return {
          success: true,
          data: groups
      }
  }

  async getOneTeacher(id: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        id,
        status: Status.active,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone: true,
        photo: true,
        email: true,
        address: true,
      },
    });
    return {
      success: true,
      data: teacher,
    };
  }

  async createTeacher(payload: CreateTeacherDto, filename?: string) {
    const existTeacher = await this.prisma.teacher.findFirst({
      where: {
        OR: [{ phone: payload.phone }, { email: payload.email }],
      },
    });

    if (existTeacher) {
      throw new ConflictException();
    }

    const hashPass = await bcyrpt.hash(payload.password, 10);
    await this.prisma.teacher.create({
      data: {
        first_name: payload.first_name,
        last_name: payload.last_name,
        photo: filename ?? null,
        phone: payload.phone,
        email: payload.email,
        password: hashPass,
        address: payload.address,
      },
    });
    return {
      success: true,
      message: 'Teacher is created',
    };
  }

  async updateTeacher(
    id: number,
    payload: updateTeacherDto,
    photo?: Express.Multer.File,
  ) {
    // Extra safety: validate id
    if (!id || isNaN(id)) {
      throw new NotFoundException('Invalid teacher ID');
    }

    const teacher = await this.prisma.teacher.findFirst({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found by this id');
    }

    // Extra safety: ensure teacher has required fields
    if (!teacher.first_name) {
      throw new NotFoundException('Teacher data is corrupted');
    }

    await this.prisma.teacher.update({
      where: { id },
      data: {
        first_name: payload.first_name ?? teacher.first_name,
        last_name: payload.last_name ?? teacher.last_name,
        photo: photo?.filename ?? teacher.photo,
        phone: payload.phone ?? teacher.phone,
        email: payload.email ?? teacher.email,
        password: teacher.password,
        address: payload.address ?? teacher.address,
      },
    });

    return {
      success: true,
      message: 'Teacher info is updated',
    };
  }

  async deleteTeacher(id: number) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found with this ID');
    }

    await this.prisma.teacher.update({
      where: { id },
      data: {
        status: Status.inactive,
      },
    });

    return {
      success: true,
      message: 'Teacher is deleted',
    };
  }
}