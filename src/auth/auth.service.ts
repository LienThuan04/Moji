
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import ms from 'ms';
import { IUser } from 'src/user/user.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly configService: ConfigService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user && await this.usersService.IsValidPassword(pass, user.hashedPassword)) {
            const { hashedPassword, ...result } = user.toObject();
            return result;
        }
        return null;
    }

    createRefreshToken = (payload: { _sub: string, _id: string }) => {
        const expiresStr = this.configService.get<string>('JWT_REFRESH_EXPIRE');
        const expiresInMs = Number(ms(expiresStr as any));
        const expiresIn = Math.floor(expiresInMs / 1000);
        const refresh_token = this.jwtService.sign(payload, { // ghi đè các giá trị trong jwt.module.ts
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: expiresIn, //chuyển từ milliseconds sang seconds
        });
        return refresh_token;
    };

    async SignUp(createUserDto: CreateUserDto) {
        const newUser = await this.usersService.create(createUserDto);
        return newUser;
    }

    async SignIn(User: IUser, res: Response): Promise<any> {
        const refresh_token = this.createRefreshToken({ _sub: 'Token Refresh', _id: User._id });

        const payload = {
            sub: 'Access Token',
            iss: 'From Moji API',
            _id: User._id,
            username: User.username,
            email: User.email,
            displayName: User.displayName,
        };
        const access_token = this.jwtService.sign(payload);
        return{
            access_token,
            User:{
                _id: User._id,
                username: User.username,
                email: User.email,
                displayName: User.displayName,
                avatarUrl: User.avatarUrl,
                avatarId: User.avatarId,
                bio: User.bio,
            }
        }
    }
}
