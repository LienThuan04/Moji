import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateSessionDto {
    @ApiProperty({
        description: 'The ID of the user',
        type: mongoose.Types.ObjectId,
    })
    @IsNotEmpty({ message: 'User ID is required' })
    @IsMongoId({ message: 'Invalid User ID format' })
    userId: mongoose.Types.ObjectId;

    @ApiProperty({
        description: 'The refresh token',
        type: String,
    })
    @IsNotEmpty({ message: 'Refresh Token is required' })
    @IsString({ message: 'Refresh Token must be a string' })
    refreshToken: string;

    // @IsNotEmpty({ message: 'Expiration date is required' })
    // @IsDate({ message: 'Expiration date must be a valid date' })
    // expiresAt: Date;
}
