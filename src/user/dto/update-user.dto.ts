import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password', 'username', 'email'] as const)) {
    @ApiProperty({
        description: 'The avatar URL of the user',
        example: 'https://example.com/avatar.jpg',
    })
    @IsString( { message: 'Avatar URL must be a string' })
    avatarUrl?: string;

    @ApiProperty({
        description: 'The avatar ID of the user',
        example: 'avatar123',
    })
    @IsString( { message: 'Avatar ID must be a string' })
    avatarId?: string;

    @ApiProperty({
        description: 'The phone number of the user',
        example: '+1234567890',
    })
    @IsNotEmpty({ message: 'Phone is required' })
    @IsString({ message: 'Phone must be a string' })
    phone: string;

    @ApiProperty({
        description: 'The bio of the user',
        example: 'This is my bio',
    })
    @IsString({ message: 'Bio must be a string' })
    bio?: string;
}
