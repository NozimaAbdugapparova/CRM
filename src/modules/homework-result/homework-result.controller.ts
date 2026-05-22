import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role';
import { Role } from '@prisma/client';
import { HomeworkResultService } from './homework-result.service';
import { CreateHomeworkResultDto, UpdateHomeworkResultDto } from './dto/homework-result.dto';

@ApiTags('Homework Result')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('homework-result')
export class HomeworkResultController {
  constructor(private readonly homeworkResultService: HomeworkResultService) {}

  /* ── CREATE / BAHOLASH ── */
  @Roles(Role.TEACHER, Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: "O'quvchi javobini baholash (ball berish)" })
  @ApiBody({ type: CreateHomeworkResultDto })
  @Post()
  create(@Body() dto: CreateHomeworkResultDto, @Req() req: Request) {
    return this.homeworkResultService.create(dto, req['user']);
  }

  /* ── GET ALL ── */
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Barcha natijalarni olish' })
  @Get('all')
  findAll() {
    return this.homeworkResultService.findAll();
  }

  /* ── GET BY HOMEWORK ID ── */
  @Roles(Role.SUPERADMIN, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Bitta homework uchun barcha natijalar (4 tab uchun)" })
  @Get('homework/:homeworkId')
  findByHomework(@Param('homeworkId', ParseIntPipe) homeworkId: number) {
    return this.homeworkResultService.findByHomework(homeworkId);
  }

  /* ── GET BY ANSWER ID ── */
  @Roles(Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Bitta answer uchun natija" })
  @Get('answer/:answerId')
  findByAnswer(@Param('answerId', ParseIntPipe) answerId: number) {
    return this.homeworkResultService.findByAnswerId(answerId);
  }

  /* ── GET ONE ── */
  @Roles(Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Bitta natijani olish' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.homeworkResultService.findOne(id);
  }

  /* ── UPDATE ── */
  @Roles(Role.TEACHER, Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: "Natijani yangilash (ballni o'zgartirish)" })
  @ApiBody({ type: UpdateHomeworkResultDto })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHomeworkResultDto,
    @Req() req: Request,
  ) {
    return this.homeworkResultService.update(id, dto, req['user']);
  }

  /* ── DELETE ── */
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: "Natijani o'chirish" })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.homeworkResultService.remove(id);
  }
}