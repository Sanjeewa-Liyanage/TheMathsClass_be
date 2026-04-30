import { Body, Controller, Post } from '@nestjs/common';
import { UserRegDto } from 'src/user/dto/user-reg.dto';
import { AuthService } from './auth.service';
import { UserLoginDto } from 'src/user/dto/user-login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() dto: UserRegDto) {
        return this.authService.register(dto)
    }

    @Post('login')
    login(@Body() dto: UserLoginDto) {
        return this.authService.login(dto)
    }
}
