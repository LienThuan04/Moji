import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ // Swagger documentation
        description: 'The username of the user',
        example: 'john_doe',
        uniqueItems: true,
    })
    @IsNotEmpty({ message: 'Username is required' })
    @IsString({ message: 'Username must be a string' })
    username: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'john_doe@example.com',
        uniqueItems: true,
    })
    @IsNotEmpty({ message: 'Email is required' })
    @IsString({ message: 'Email must be a string' })
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        example: '123',
    })
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    password: string;

    @ApiProperty({
        description: 'The display name of the user',
        example: 'John Doe',
    })
    @IsNotEmpty({ message: 'Display name is required' })
    @IsString({ message: 'Display name must be a string' })
    displayName: string;
}

export class LoginUserDto {
    @IsEmail({}, { message: 'Email không hợp lệ' }) //custom message validator
    @IsNotEmpty({ message: 'Email không được để trống' })
    @ApiProperty( { example: 'admin', description: 'User email' } )
    username: string; //default là public có thể bỏ qua

    @ApiProperty( { example: '123', description: 'User password' } )
    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    password: string;
}