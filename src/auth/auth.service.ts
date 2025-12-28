import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import ms from 'ms';
import { IUser } from 'src/user/user.interface';
import { SessionService } from 'src/session/session.service';
import mongoose, { Types } from 'mongoose';
import { CreateSessionDto } from 'src/session/dto/create-session.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly configService: ConfigService,
        private jwtService: JwtService,
        private readonly sessionService: SessionService,
    ) { };

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user && await this.usersService.IsValidPassword(pass, user.hashedPassword)) {
            const { hashedPassword, ...result } = user.toObject();
            return result;
        }
        return null;
    };

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

    async SignUp(createUserDto: CreateUserDto): Promise<any> {
        const newUser = await this.usersService.create(createUserDto);
        return newUser ? newUser : null;
    };

    async SignIn(User: IUser, res: Response): Promise<any> {
        const refresh_token = this.createRefreshToken({ _sub: 'Token Refresh', _id: User._id });
        const createSessionDto: CreateSessionDto = {
            userId: new Types.ObjectId(User._id),
            refreshToken: refresh_token,
        };
        const setRefreshTokenForUser = await this.sessionService.create(createSessionDto);
        if (!setRefreshTokenForUser) {
            throw new BadRequestException('Cannot set refresh token for user');
        }
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true, //chỉ cho phép truy cập cookie từ phía server
            // secure: this.configService.get<string>('NODE_ENV') === 'production', //chỉ gửi cookie qua kết nối HTTPS trong môi trường production
            sameSite: 'none', // cho phép gửi cookie trong các yêu cầu cross-site
            maxAge: Number(ms(this.configService.get<string>('JWT_REFRESH_EXPIRE') as any)), //thời gian sống của cookie tính bằng milliseconds
        });

        const payload = {
            sub: 'Access Token',
            iss: 'From Moji API',
            _id: User._id,
            username: User.username,
            email: User.email,
            displayName: User.displayName,
            avatarUrl: User.avatarUrl, 
            avatarId: User.avatarId,
            phone: User.phone, 
            bio: User.bio
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
                phone: User.phone,
                bio: User.bio,
            }
        }
    };

    refreshAccessToken = async (refreshToken: string, res: Response): Promise<any> => {
        try {
            if (!refreshToken || refreshToken === '' || refreshToken === 'undefined') {
                throw new BadRequestException('No refresh token provided');
            }
            this.jwtService.verify(refreshToken, { // xác thực token ghi đè secret của jwt.module.ts
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            });
            const result = await this.sessionService.findRefreshToken(refreshToken);
            if (!result) {
                throw new BadRequestException('Invalid refresh token');
            }
            const userId = String(result.userId);
            const user = await this.usersService.findOne(userId);
            const User: IUser = {
                _id: String(user?._id),
                username: String(user?.username),
                email: String(user?.email),
                displayName: String(user?.displayName),
                phone: user?.phone,
                avatarUrl: user?.avatarUrl,
                avatarId: user?.avatarId,
                bio: user?.bio,
            };
            if (!User || !User._id || !User.username || !User.email || !User.displayName) {
                throw new BadRequestException('User not found for this refresh token');
            } 
            res.clearCookie('refresh_token'); //xóa cookie refresh token cũ
            return this.SignIn(User, res); //tạo mới access token và refresh token

        } catch (error) {
            console.log(error);
            throw new BadRequestException('Could not refresh access token');
        }
    };

    async SignOut(userId: string, res: Response): Promise<any> {
        const result = await this.sessionService.remove(userId);
        if (!result) {
            throw new BadRequestException('Cannot sign out user because session not found');
        }
        res.clearCookie('refresh_token');
        return { message: 'User logged out successfully' };
    }
}
