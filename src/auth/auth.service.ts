import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRegDto } from 'src/user/dto/user-reg.dto';
import { UserRole } from 'src/user/enum/userrole.enum';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }


    //register function

    async register(dto: UserRegDto) {

        const newUser = await this.userService.createUser(dto);

        if (!newUser.id || !newUser.email) {
            throw new BadRequestException("Registration Failled email or id missing")
        }

        const tokens = await this.getTokens(newUser.id, newUser.email, newUser.role as UserRole);

        await this.userService.updateRefreshTokenHash(newUser.id, tokens.refreshToken);
        return tokens;
    }

    async getTokens(id: string, email: string, role: string) {
        const payload = {
            sub: id,
            email: email,
            role: role
        };
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET_KEY,
                expiresIn: '1h'
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET_KEY,
                expiresIn: '7d'
            })
        ])
        return {
            accessToken: at,
            refreshToken: rt

        }
    }
}
