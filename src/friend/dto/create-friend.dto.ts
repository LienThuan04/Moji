import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateFriendDto {
    @IsNotEmpty({ message: "Field 'userA' is required." })
    @IsMongoId({ message: "Field 'userA' must be a valid MongoDB ObjectId." })
    userA: string;

    @IsNotEmpty({ message: "Field 'userB' is required." })
    @IsMongoId({ message: "Field 'userB' must be a valid MongoDB ObjectId." })
    userB: string;
}
