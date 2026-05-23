import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { CoursesModule } from './modules/courses/courses.module';
import { GroupsModule } from './modules/groups/groups.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { AuthModule } from './modules/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LessonsModule } from './modules/lessons/lessons.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { HomeworkModule } from './modules/homework/homework.module';
import { HomeworkAnswerModule } from './modules/homework-answer/homework-answer.module';
import { HomeworkResultModule } from './modules/homework-result/homework-result.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: 
  [
      ServeStaticModule.forRoot({
        rootPath: join(process.cwd(),'src', 'uploads'),
        serveRoot:'/files'
      }),
    ConfigModule.forRoot({
        isGlobal: true
    }),
    AuthModule,
    UsersModule,
    TeachersModule,
    StudentsModule,
    CoursesModule,
    GroupsModule,
    RoomsModule,
    LessonsModule,
    AttendanceModule,
    HomeworkModule,
    HomeworkAnswerModule,
    HomeworkResultModule,
    DashboardModule
  ]
})
export class AppModule {}
