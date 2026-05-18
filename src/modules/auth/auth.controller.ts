import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('login')
    login(@Body() payload: LoginDto) {
        return this.authService.unifiedLogin(payload);
    }

    @Post('user/login')
    userLogin(@Body() payload: LoginDto){
        return this.authService.userLogin(payload);
    }

    @Post('teacher/login')
    teacherLogin(@Body() payload: LoginDto){
        return this.authService.teacherLogin(payload);
    }

    @Post('student/login')
    studentLogin(@Body() payload: LoginDto){
        return this.authService.studentLogin(payload);
    }
}
