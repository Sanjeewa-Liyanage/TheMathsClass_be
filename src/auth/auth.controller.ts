import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserRegDto } from 'src/user/dto/user-reg.dto';
import { AuthService } from './auth.service';
import { UserLoginDto } from 'src/user/dto/user-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';
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
    @Post('force-login')
    forceLogin(@Body() dto: UserLoginDto) {
        return this.authService.forceLogin(dto);
    }
    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    logout(@Req() req: any) {
        const userId = req.user.sub;
        return this.authService.logout(userId);
    }
}
