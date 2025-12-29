import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { User } from 'src/decorator/user.decorator';
import type { IUser } from 'src/user/user.interface';
import { Public, ResponseMessage } from 'src/decorator/metadata';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiBody } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Public()
    @ApiBody({ type: LoginUserDto })
    @UseGuards(LocalAuthGuard)// Áp dụng LocalAuthGuard cho route đăng nhập
    @Post('signin')
    @ResponseMessage('User logged in successfully')
    async login(@User() user: IUser, @Res({ passthrough: true }) res: Response) {
        return await this.authService.SignIn(user, res);
    };

    @Get('account')
    @ResponseMessage('User account retrieved successfully')
    async getAccount(@User() user: IUser) {
        return user;
    }

    @Public()
    @Post('refresh-token')
    @ResponseMessage('Access token refreshed successfully')
    async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['refresh_token'];
        return await this.authService.refreshAccessToken(refreshToken, res);
    };

    @Public()
    @ApiBody({ type: CreateUserDto })
    @ResponseMessage('User registered successfully')
    @Post('signup')
    async register(@Body() createUserDto: CreateUserDto) {
        const newUser = await this.authService.SignUp(createUserDto);
        return newUser;
    };

    @Post('signout')
    async logout(@User() user: IUser, @Res({ passthrough: true }) res: Response) {
        const test = user;
        return await this.authService.SignOut(user._id, res);
    };
}
