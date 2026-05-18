import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create.lesson.dto';
import { Roles } from 'src/common/decorators/role';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('lessons')
export class LessonsController {
    constructor(private readonly lessonService: LessonsService){}


    @ApiOperation({
        summary:`${Role.ADMIN}, ${Role.TEACHER}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.TEACHER, Role.SUPERADMIN)
    @Get('all')
    getAllLessons(){
        return this.lessonService.getAllLessons()
    }

    @ApiOperation({
        summary: `${Role.STUDENT}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.STUDENT, Role.SUPERADMIN, Role.TEACHER, Role.ADMIN)
    @Get('my/group/:groupId')
    getMyGroupLessons(
        @Param('groupId', ParseIntPipe) groupId : number,
        @Req() req: Request
    ){
        return this.lessonService.getMyGroupLessons(groupId, req['user'])
    }

    @ApiOperation({
        summary:`${Role.ADMIN}, ${Role.TEACHER}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.TEACHER, Role.SUPERADMIN)
    @Post('/new')
    createLesson(
        @Body() payload : CreateLessonDto,
        @Req() req: Request
    ){
        return this.lessonService.createLesson(payload, req["user"])
    }
}
