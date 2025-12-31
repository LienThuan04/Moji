import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto {
    @ApiProperty({ description: "The content of the message.", example: "Hello, how are you?" })
    @IsNotEmpty({ message: "Field 'content' is required." })
    @IsString({ message: "Field 'content' must be a string." })
    content: string;

    // @ApiProperty({ description: "The ID of the conversation this message belongs to.", example: "64a7b2f5c9e77b6f4d8e3a1d" })
    // @IsNotEmpty({ message: "Field 'conversationId' is required." })
    // @IsString({ message: "Field 'conversationId' must be a string." })
    // conversationId: string;

    @ApiProperty({ description: "The ID of the recipient user.", example: "64a7b2f5c9e77b6f4d8e3a1e" })
    @IsNotEmpty({ message: "Field 'recipientId' is required." })
    @IsString({ message: "Field 'recipientId' must be a string." })
    recipientId: string;
}
