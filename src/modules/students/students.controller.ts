import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { StudentsService } from './students.service';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { CreateStudentDto } from './dto/create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateStudentDto } from './dto/update.student.dto';
import { paginationDto } from './dto/pagination.dto';


@ApiBearerAuth()
@Controller('students')
export class StudentsController {
    constructor(private readonly studentService : StudentsService){}


    @ApiOperation({
        summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get('all')
    getAllStudents(
        @Query() page: paginationDto
    ){
        return this.studentService.getAllStudents(page)
    }

    @ApiOperation({
        summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get('all/archived')
    getAllInactiveStudents(){
        return this.studentService.getAllInactiveStudents()
    }

    @ApiOperation({
        summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get('single/:id')
    getOneStudent(
        @Param('id', ParseIntPipe) id: number 
    ){
        return this.studentService.getOneStudent(id)
    }

    @ApiOperation({
        summary: `${Role.SUPERADMIN}, ${Role.STUDENT}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.STUDENT)
    @Get('own/groups')
    getMyGroups(
        @Req() req : Request
    ){
        return this.studentService.getMyGroups(req['user'])
    }



    @ApiOperation({
        summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
        description: "Bu endpointga admin va superadmin huquqi bor"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                first_name: {type: 'string'},
                last_name: {type: 'string'},
                email: {type: 'string'},
                password: {type: 'string'},
                phone: {type: 'string'},
                photo: {type: 'string', format: 'binary'},
                address: {type: 'string'},
                birth_date: {type: 'string', format: 'date', example: '2000-01-01'}
            }
        }
    })
    @UseInterceptors(FileInterceptor('photo', {
        storage: diskStorage({
            destination: './src/uploads',
            filename:(req, file, cb) => {
                const filename =Date.now()+ "." + file.mimetype.split("/")[1]
                cb(null, filename)
            }
        }),
        fileFilter:(req, file, cb) =>{
            const existFile = ['png', 'jpg', 'jpeg']

            if(!existFile.includes(file.mimetype.split('/')[1])){
                cb(new UnsupportedMediaTypeException(), false)
            }

            cb(null, true)
        }
    }))
    @Post('student/add')
    createStudent(
        @Body() payload : CreateStudentDto,
        @UploadedFile() file? : Express.Multer.File
    ){
        return this.studentService.createStudent(payload, file?.filename)
    }



    @ApiOperation({
        summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
        description: "Bu endpointga admin va superadmin huquqi bor"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Patch("/update/:id")
    updateStudent(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateStudentDto,
        @UploadedFile() photo?: Express.Multer.File,
    ){
        return this.studentService.updateStudent(id, payload, photo)
    }

    @ApiOperation({
        summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
        description: "Bu endpointga admin va superadmin huquqi bor"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Delete("/delete/:id")
    deleteStudent(
        @Param('id', ParseIntPipe) id: number
    ){
        return this.studentService.deleteStudent(id)
    }
}
