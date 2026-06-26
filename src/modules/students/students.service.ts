import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateStudentDto } from './dto/create.dto';
import * as bcrypt from 'bcrypt';
import { Status } from '@prisma/client';
import { EmailService } from 'src/common/email/email.service';
import { UpdateStudentDto } from './dto/update.student.dto';
import { paginationDto } from './dto/pagination.dto';

@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private emaileService: EmailService,
  ) {}

  async getAllStudents(pagination: paginationDto) {
    const {page, limit} = pagination
    const students = await this.prisma.student.findMany({
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
        birth_date: true,
      },
      skip: (limit? +limit : 10) * (page? +page-1 : 0),
      take:limit? +limit : 10
    });
    return {
      success: true,
      data: students,
    };
  }

  async getAllInactiveStudents(){
    const students = await this.prisma.student.findMany({
                where:{
                    OR:[
                        {status: Status.inactive},
                        {status: Status.freeze}
                    ]
                },
                select:{
                    id: true,
                    first_name: true,
                    last_name: true,
                    phone: true,
                    photo: true,
                    email: true,
                    address: true,
                    birth_date: true
                }
            })
            return {
                success: true,
                data:students
            }
  }

  async getOneStudent(id: number) {
    const student = await this.prisma.student.findUnique({
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
        birth_date: true,
      },
    });
    return {
      success: true,
      data: student,
    };
  }

  async getMyGroups(currentUser : {id: number}){
    const myGroups = await this.prisma.studentGroup.findMany({
        where:{student_id: currentUser.id},
        select:{
            groups:{
                select:{
                    id: true,
                    name: true,
                    courses: true,
                    rooms: true,
                    teachers: true,
                    start_date: true,
                    status: true
                }
            }
        }
    })

    return {
        success: true,
        data: myGroups.map(el => el.groups)
    }
  }

  async createStudent(payload: CreateStudentDto, filename?: string) {
    const existStudent = await this.prisma.student.findFirst({
      where: {
        OR: [{ phone: payload.phone }, { email: payload.email }],
      },
    });

    if (existStudent) {
      throw new ConflictException('Student is already exist');
    }

    const hashPass = await bcrypt.hash(payload.password, 10);
    await this.prisma.student.create({
      data: {
        first_name: payload.first_name,
        last_name: payload.last_name,
        photo: filename ?? null,
        phone: payload.phone,
        birth_date: new Date(payload.birth_date),
        email: payload.email,
        password: hashPass,
        address: payload.address,
      },
    });

    await this.emaileService.sendEmail(
      payload.email,
      payload.phone,
      payload.password,
    );

    return {
      success: true,
      message: 'Student created',
    };
  }

  async updateStudent(id: number, payload: UpdateStudentDto, photo?: Express.Multer.File) {
    const student = await this.prisma.student.findFirst({
      where: { id }
    });

    if (!student) {
      throw new NotFoundException('Student not found by this id');
    }

    await this.prisma.student.update({
      where: { id },
      data: {
        first_name: payload.first_name ?? student.first_name,
        last_name: payload.last_name ?? student.last_name,
        photo: photo?.filename ?? student.photo,
        phone: payload.phone ?? student.phone,
        birth_date: payload.birth_date ? new Date(payload.birth_date): student.birth_date,
        email: payload.email ?? student.email,
        password: student.password,
        address: payload.address ?? student.address,
      }
    })

    return {
        success: true,
        message: "Student info is updated"
    }
  }

  async deleteStudent(id: number){
    const student = await this.prisma.student.findFirst({
        where: {id}
    })

    if(!student){
        throw new NotFoundException("Student not found with this ID")
    }

    await this.prisma.student.update({
        where:{ id},
        data:{
            status: Status.inactive
        }
    })

    return {
        success: true,
        message: "Student is deleted"
    }
  }
}