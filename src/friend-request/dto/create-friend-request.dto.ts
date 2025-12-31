import { IsNotEmpty, IsString } from "class-validator";

export class CreateFriendRequestDto {
    // @IsNotEmpty({ message: "Field 'to' is required." })
    // @IsString({ message: "Field 'to' must be a string." })
    // from: string;

    @IsNotEmpty({ message: "Field 'from' is required." })
    @IsString({ message: "Field 'from' must be a string." })
    to: string;

    @IsString({ message: "Field 'message' must be a string." })
    message?: string;
}
