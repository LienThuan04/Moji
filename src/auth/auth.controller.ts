import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}
    @Post('signin')
    login() {
        return 'This action handles user login';
    }

    @Post('signup')
    register(@Body() createUserDto: CreateUserDto) {
        const newUser = this.authService.SignUp(createUserDto);
        return newUser;
    }
}
