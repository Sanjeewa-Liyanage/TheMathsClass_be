import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from 'src/user/dto/user-login.dto';
import { UserRegDto } from 'src/user/dto/user-reg.dto';
import { UserRole } from 'src/user/enum/userrole.enum';
import { UserService } from 'src/user/user.service';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }


    //* _________________________________ **register function** _________________________________ 

    async register(dto: UserRegDto) {

        const newUser = await this.userService.createUser(dto);

        if (!newUser.id || !newUser.email) {
            throw new BadRequestException("Registration Failled email or id missing")
        }

        if (newUser.role === UserRole.STUDENT) {
            const qrToken = await this.generateQrToken(newUser.id, newUser.email, newUser.userCode);
            await this.userService.updateQrtoken(newUser.id, qrToken.qrToken);
        }

        const tokens = await this.getTokens(newUser.id, newUser.email, newUser.role as UserRole,);
        await this.userService.updateRefreshTokenHash(newUser.id, tokens.refreshToken);
        return { tokens };

    }
    //*_____________________________________** login function **_____________________________________  

    async login(dto: UserLoginDto) {
        const user = await this.userService.validateUser(dto.password, dto.userCode, dto.email);
        if (!user) {
            throw new BadRequestException('Invalid user');
        }

        // ── Single-device check (students only) ──
        if (user.role === UserRole.STUDENT && user.activeSessionId) {
            throw new ConflictException({
                message: 'You are already logged in on another device. Please log out from the other device first, or use force-login.',
                requireForceLogin: true,
            });
        }

        // Generate sessionId for students
        const sessionId = user.role === UserRole.STUDENT ? randomUUID() : undefined;

        const tokens = await this.getTokens(user.id, user.email, user.role as UserRole, sessionId);
        await this.userService.updateRefreshTokenHash(user.id, tokens.refreshToken);

        // Save active session for students
        if (sessionId) {
            await this.userService.updateActiveSession(user.id, sessionId);
        }

        return tokens;
    }


    //*_________________________________ **token isuue tokens** _________________________________ 

    async getTokens(id: string, email: string, role: string, sessionId?: string) {
        const payload: any = {
            sub: id,
            email: email,
            role: role
        };

        if (sessionId) {
            payload.sessionId = sessionId;
        }

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
    //* __________________________**forcelogin**__________________________
    async forceLogin(dto: UserLoginDto) {
        const user = await this.userService.validateUser(dto.password, dto.userCode, dto.email);
        if (!user) {
            throw new BadRequestException('Invalid user');
        }

        // Generate new sessionId (overwrites old one, invalidating previous device)
        const sessionId = user.role === UserRole.STUDENT ? randomUUID() : undefined;

        const tokens = await this.getTokens(user.id, user.email, user.role as UserRole, sessionId);
        await this.userService.updateRefreshTokenHash(user.id, tokens.refreshToken);

        if (sessionId) {
            await this.userService.updateActiveSession(user.id, sessionId);
        }

        return tokens;
    }

    //*____________________________logout________________________________
    async logout(userId: string) {
        await this.userService.clearSession(userId);
        return { message: 'Logged out successfully' };
    }



    //* ________________________**generate Qr token**__________________________
    async generateQrToken(id: string, email: string, userCode: string) {
        const payload = {
            sub: id,
            email: email,
            userCode: userCode
        }
        return {
            qrToken: await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET_KEY
            })
        }
    }
}
