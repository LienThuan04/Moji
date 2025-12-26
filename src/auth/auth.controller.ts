import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { User } from 'src/decorator/user.decorator';
import type { IUser } from 'src/user/user.interface';
import { Public, ResponseMessage } from 'src/decorator/metadata';
import { LocalAuthGuard } from './local-auth.guard';
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)// Áp dụng LocalAuthGuard cho route đăng nhập
    @Post('signin')
    async login(@User() user: IUser, @Res({ passthrough: true }) res: Response) {
        return {
            message: 'Logged in successfully',
            ...await this.authService.SignIn(user, res)
        };
    }

    @Public()
    @ResponseMessage('User registered successfully')
    @Post('signup')
    register(@Body() createUserDto: CreateUserDto) {
        const newUser = this.authService.SignUp(createUserDto);
        return newUser;
    }
}
