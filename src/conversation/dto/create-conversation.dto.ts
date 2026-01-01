import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

class ParticipantDto {
    @ApiProperty({ description: "The ID of the participant user.", example: "64a7b2f5c9e77b6f4d8e3a1b" })
    @IsNotEmpty({ message: "Field 'userId' is required." })
    @IsString({ message: "Field 'userId' must be a string." })
    userId: string;
    
    @ApiProperty({ description: "The date and time when the participant joined.", example: "2024-07-10T14:48:00.000Z" })
    @IsNotEmpty({ message: "Field 'joinedAt' is required." })
    joinedAt: Date;
}

class groupDto {
        @ApiProperty({ description: "The name of the group.", example: "Study Buddies" })
        @IsNotEmpty({ message: "Field 'name' is required." })
        @IsString({ message: "Field 'name' must be a string." })
        name: string;

        @ApiProperty({ description: "The ID of the user who created the group.", example: "64a7b2f5c9e77b6f4d8e3a1b" })
        @IsNotEmpty({ message: "Field 'createdBy' is required." })
        @IsString({ message: "Field 'createdBy' must be a string." })
        createdBy: string;
}

export class CreateConversationDto {
    @ApiProperty({ description: "The type of the conversation (e.g., 'private', 'group').", example: "private" })
    @IsNotEmpty({ message: "Field 'name' is required." })
    @IsString({ message: "Field 'name' must be a string." })
    type: string;

    @ApiProperty({ description: "The participants involved in the conversation." })
    @IsNotEmpty({ message: "Field 'participants' is required." })
    @IsArray({ message: "Field 'participants' must be an array." })
    @ValidateNested({ each: true })
    @Type(() => ParticipantDto)
    participants: ParticipantDto[];

    @ApiProperty({ description: "The group details if the conversation is a group." })
    @IsOptional({ message: "Field 'group' is optional." })
    @ValidateNested()
    @Type(() => groupDto)
    group?: groupDto;

    @ApiProperty({ description: "The last message in the conversation.", example: "Hey, are we still on for tomorrow?" })
    @IsNotEmpty({ message: "Field 'lastMessage' is required." })
    lastMessage: Date;

    @ApiProperty({ description: "A map tracking unread message counts for each participant." })
    @IsNotEmpty({ message: "Field 'unreadCounts' is required." })
    unreadCounts: Map<any, any>;
};

export class CreateConversationGroupDto {
    @ApiProperty({ description: "The type of the conversation (e.g., 'private', 'group').", example: "group" })
    @IsNotEmpty({ message: "Field 'name' is required." })
    @IsString({ message: "Field 'name' must be a string." })
    type: string;

    @ApiProperty({ description: "The Name of the group.", example: "Study Buddies" })
    @IsNotEmpty({ message: "Field 'name' is required." })
    @IsString({ message: "Field 'name' must be a string." })
    name: string;

    @ApiProperty({ description: "The participants involved in the conversation." })
    @IsNotEmpty({ message: "Field 'participants' is required." })
    @IsArray({ message: "Field 'participants' must be an array." })
    memberIds: string[];
}
