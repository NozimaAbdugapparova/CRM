import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { HomeworkAnswerService } from './homework-answer.service';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/role';
import { CreateHomeworkAnswerDto } from './dto/homework.answer.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';


@ApiTags('Homework Answer')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('homework-answer')
export class HomeworkAnswerController {
  constructor(private readonly homeworkAnswerService: HomeworkAnswerService) {}

  // Talaba javob yuboradi
  @Roles(Role.STUDENT, Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: "Talaba uyga vazifaga javob yuboradi" })
  @ApiConsumes('multipart/form-data')
      @ApiBody({
          schema:{
              type: "object",
              properties: {
                  homework_id: {type: 'number'},
                  file: {type: 'string', format: 'binary'},
                  title: {type: 'string'}
              }
          }
      })
      @UseInterceptors(FileInterceptor("file", {
          storage: diskStorage({
              destination: './src/uploads/files',
              filename: (req, file, cb) =>{
                  const filename = Date.now() + '.' +file.mimetype.split("/")[1]
                  cb(null, filename)
              }
          })
      }))
  @Post('/upload')
  create(
    @Body() dto: CreateHomeworkAnswerDto, 
    @Req() req: Request,
    @UploadedFile() file? : Express.Multer.File
) {
    return this.homeworkAnswerService.create(dto, req["user"], file?.filename);
  }

  // Barcha javoblarni ko'rish (admin/teacher)
  @Roles(Role.SUPERADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Barcha javoblarni olish" })
  @Get("all")
  findAll() {
    return this.homeworkAnswerService.findAll();
  }

  // Bitta homework uchun javoblar
  @Roles(Role.SUPERADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Bitta homework uchun barcha javoblar" })
  @Get("homework/:homeworkId")
  findByHomework(@Param("homeworkId", ParseIntPipe) homeworkId: number) {
    return this.homeworkAnswerService.findByHomework(homeworkId);
  }

  // Talabaning o'z javoblari
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: "Talabaning o'z javoblari" })
  @Get("my")
  findMy(@Req() req: Request) {
    return this.homeworkAnswerService.findMyAnswers(req["user"]);
  }

  // Bitta javob
  @Roles(Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Bitta javobni olish" })
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.homeworkAnswerService.findOne(id);
  }

  // Javobni o'chirish
  @Roles(Role.SUPERADMIN, Role.STUDENT)
  @ApiOperation({ summary: "Javobni o'chirish" })
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    return this.homeworkAnswerService.remove(id, req["user"]);
  }
}