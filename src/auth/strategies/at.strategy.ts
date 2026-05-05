import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_KEY || '',
        });
    }

    async validate(payload: any) {
        if (payload.role === 'STUDENT' && payload.sessionId) {
            const user = await this.userService.findbyId(payload.sub);
            if (!user || user.activeSessionId !== payload.sessionId) {
                throw new UnauthorizedException(
                    'Session expired. You have been logged in from another device.',
                );
            }
        }

        return payload;
    }
}
