import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateHomeworkDto } from './dto/create.homework.dto';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';


@ApiBearerAuth()
@Controller('homework')
export class HomeworkController {
    constructor(private readonly homeworkService: HomeworkService) {}

    @ApiOperation({ summary: `${Role.ADMIN}, ${Role.TEACHER}` })
    @ApiQuery({ name: 'groupId', required: false, type: Number, description: 'Guruh ID bo\'yicha filter' })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
    @Get('all')
    getAllHomework(@Query('groupId') groupId?: string) {
        const gId = groupId ? Number(groupId) : undefined;
        return this.homeworkService.getAllHomework(gId);
    }

    @ApiOperation({ summary: `${Role.STUDENT}` })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.STUDENT)
    @Get('own/:lessonId')
    getOwnHomework(
        @Param('lessonId', ParseIntPipe) lessonId: number,
        @Req() req: Request
    ) {
        return this.homeworkService.getOwnHomework(lessonId, req['user']);
    }

    @ApiOperation({ summary: `${Role.ADMIN}, ${Role.TEACHER}` })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './src/uploads/files',
            filename: (req, file, cb) => {
                const filename = Date.now() + '.' + file.mimetype.split('/')[1];
                cb(null, filename);
            }
        })
    }))
    @Post('/new')
    createHomework(
        @Body() payload: CreateHomeworkDto,
        @Req() req: Request,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.homeworkService.createHomework(payload, req['user'], file?.filename);
    }

    @ApiOperation({ summary: 'Update homework' })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './src/uploads/files',
            filename: (req, file, cb) => {
                const filename = Date.now() + '.' + file.mimetype.split('/')[1];
                cb(null, filename);
            }
        })
    }))
    @Put('update/:id')
    updateHomework(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: Partial<CreateHomeworkDto>,
        @Req() req: Request,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.homeworkService.updateHomework(id, payload, req['user'], file?.filename);
    }

    @ApiOperation({ summary: 'Delete homework' })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
    @Delete('delete/:id')
    deleteHomework(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request
    ) {
        return this.homeworkService.deleteHomework(id, req['user']);
    }
}