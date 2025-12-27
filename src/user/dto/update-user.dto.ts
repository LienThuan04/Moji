import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password', 'username', 'email'] as const)) {
    @IsString( { message: 'Avatar URL must be a string' })
    avatarUrl?: string;

    @IsString( { message: 'Avatar ID must be a string' })
    avatarId?: string;

    @IsNotEmpty({ message: 'Phone is required' })
    @IsString({ message: 'Phone must be a string' })
    phone: string;

    @IsString({ message: 'Bio must be a string' })
    bio?: string;

}
