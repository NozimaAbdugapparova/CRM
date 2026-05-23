import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { updateTeacherDto } from './dto/update.teacher.dto';

@ApiBearerAuth()
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teacherService: TeachersService) {}

  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
  })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get('all')
  getAllTeachers() {
    return this.teacherService.getAllTeachers();
  }

  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
  })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get('all/archived')
  getAllInactiveTeachers() {
    return this.teacherService.getAllInactiveTeachers();
  }

  @Get('all/groups/:id')
  getAllgroups(
      @Param('id', ParseIntPipe) id: number
  ){
      return this.teacherService.getAllgroups(id)
  }

  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
  })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get('single/:id')
  getOneTeachers(@Param('id', ParseIntPipe) id: number) {
    return this.teacherService.getOneTeacher(id);
  }

  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
    description: 'Bu endpointga admin va superadmin huquqi bor',
  })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        phone: { type: 'string' },
        photo: { type: 'string', format: 'binary' },
        address: { type: 'string' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './src/uploads',
        filename: (req, file, cb) => {
          const filename = Date.now() + '.' + file.mimetype.split('/')[1];
          cb(null, filename);
        },
      }),
    }),
  )
  @Post('create')
  createTeacher(
    @Body() payload: CreateTeacherDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log(file);
    return this.teacherService.createTeacher(payload, file?.filename);
  }

  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
    description: 'Bu endpointga admin va superadmin huquqi bor',
  })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Patch('update/:id')
  updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: updateTeacherDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.teacherService.updateTeacher(id, payload, photo);
  }

  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
    description: 'Bu endpointga admin va superadmin huquqi bor',
  })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Delete('delete/:id')
  deleteStudent(@Param('id', ParseIntPipe) id: number) {
    return this.teacherService.deleteTeacher(id);
  }
}
