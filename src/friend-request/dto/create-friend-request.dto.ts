import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateFriendRequestDto {
    // @IsNotEmpty({ message: "Field 'to' is required." })
    // @IsString({ message: "Field 'to' must be a string." })
    // from: string;
    @ApiProperty({ description: "The ID of the user sending the friend request.", example: "64a7b2f5c9e77b6f4d8e3a1b" })
    @IsNotEmpty({ message: "Field 'from' is required." })
    @IsString({ message: "Field 'from' must be a string." })
    to: string;

    @ApiProperty({ description: "The ID of the user receiving the friend request.", example: "64a7b2f5c9e77b6f4d8e3a1c" })
    @IsString({ message: "Field 'message' must be a string." })
    message?: string;
}
