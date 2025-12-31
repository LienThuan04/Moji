import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateFriendDto {
    @ApiProperty({ description: "The ID of the first user.", example: "64a7b2f5c9e77b6f4d8e3a1b" })
    @IsNotEmpty({ message: "Field 'userA' is required." })
    @IsMongoId({ message: "Field 'userA' must be a valid MongoDB ObjectId." })
    userA: string;

    @ApiProperty({ description: "The ID of the second user.", example: "64a7b2f5c9e77b6f4d8e3a1c" })
    @IsNotEmpty({ message: "Field 'userB' is required." })
    @IsMongoId({ message: "Field 'userB' must be a valid MongoDB ObjectId." })
    userB: string;
}
