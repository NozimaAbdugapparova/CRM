import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';


@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService

    ){}

      async unifiedLogin(payload: LoginDto) {
    // Admin tekshirish
    try {
      const result = await this.userLogin(payload);
      return { ...result, role: 'admin' };
    } catch {}
 
    // Teacher tekshirish
    try {
      const result = await this.teacherLogin(payload);
      return { ...result, role: 'teacher' };
    } catch {}
 
    // Student tekshirish
    try {
      const result = await this.studentLogin(payload);
      return { ...result, role: 'student' };
    } catch {}
 
    throw new UnauthorizedException("Login yoki parol noto'g'ri.");
  }

    async userLogin(payload: LoginDto){
        const phone = payload.phone.replace(/^\+998/, "");
        const existUser = await this.prisma.user.findFirst({
            where: {
                OR:[
                    {phone: payload.phone},
                    {phone: phone}
                ]
            }
        })

        if(!existUser) throw new NotFoundException("Phone or password is wrong");
        if(!await bcrypt.compare(payload.password, existUser.password)){
            throw new BadRequestException("Phone or password is wrong");
        }

        return{
            succes: true,
            message: "You are logged in",
            token: this.jwtService.sign({
                id: existUser.id,
                email: existUser.email,
                role: existUser.role,
                first_name: existUser.first_name,
                last_name: existUser.last_name
            })
        }
    }

    async teacherLogin(payload: LoginDto){
        const phone = payload.phone.replace(/^\+998/, "");
        const existTeacher = await this.prisma.teacher.findFirst({
            where: {
                OR:[
                    {phone: payload.phone},
                    {phone: phone}
                ]
            }
        })

        if(!existTeacher) throw new NotFoundException("Phone or password is wrong");
        if(!await bcrypt.compare(payload.password, existTeacher.password)){
            throw new BadRequestException("Phone or password is wrong");
        }

        return{
            succes: true,
            message: "You are logged in",
            token: this.jwtService.sign({
                id: existTeacher.id,
                email: existTeacher.email,
                role: Role.TEACHER,
                first_name: existTeacher.first_name,
                last_name: existTeacher.last_name
            })
        }
    }

    async studentLogin(payload: LoginDto){
        const phone = payload.phone.replace(/^\+998/, "");
        const existStudent = await this.prisma.student.findFirst({
            where: {
                OR:[
                    {phone: payload.phone},
                    {phone: phone}
                ]
            }
        })

        if(!existStudent) throw new NotFoundException("Phone or password is wrong");
        if(!await bcrypt.compare(payload.password, existStudent.password)){
            throw new BadRequestException("Phone or password is wrong");
        }

        return{
            succes: true,
            message: "You are logged in",
            token: this.jwtService.sign({
                id: existStudent.id,
                email: existStudent.email,
                role: Role.STUDENT,
                first_name: existStudent.first_name,
                last_name: existStudent.last_name
            })
        }
    }
}
