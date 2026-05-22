import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { CreateCourseDto } from './dto/create.course.dto';
import { UpdateCourseDto } from './dto/update.course.dto';

@ApiBearerAuth()
@Controller('courses')
export class CoursesController {
    constructor(private readonly courseService: CoursesService) {}

    @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get('all')
    getAllCourses() {
        return this.courseService.getAllCourses();
    }

    @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Post('/add/new')
    createCourse(@Body() payload: CreateCourseDto) {
        return this.courseService.createCourse(payload);
    }

    @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Put('update/:id')
    updateCourse(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateCourseDto,
    ) {
        return this.courseService.updateCourse(id, payload);
    }

    @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Delete('delete/:id')
    deleteCourse(@Param('id', ParseIntPipe) id: number) {
        return this.courseService.deleteCourse(id);
    }
}