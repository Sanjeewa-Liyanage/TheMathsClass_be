import { Body, Controller, Post } from '@nestjs/common';
import { UserRegDto } from 'src/user/dto/user-reg.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() dto: UserRegDto) {
        return this.authService.register(dto)
    }
}
