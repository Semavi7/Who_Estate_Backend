import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        const jwtSecret = configService.get<string>('JWT_SECRET')
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in the environment variables')
        }
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req?.cookies?.['accessToken'], 
            ]),
            ignoreExpiration: false,
            secretOrKey: jwtSecret
        })
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email, roles: payload.roles }
    }
}