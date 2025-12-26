import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, trim: true, lowercase: true })
    username: string;

    @Prop({ required: true })
    hashedPassword: string;

    @Prop({required: false, unique: true, trim: true, lowercase: true })
    email: string;

    @Prop({ required: false, trim: true })
    displayName: string;

    // Optional fields
    @Prop({default: ''})
    avatarUrl: string; // Link to avatar image

    @Prop({ default: '' })
    avatarId: string; // ID of avatar image in storage service

    @Prop({ default: '', maxlength: 500 })
    bio: string;

    @Prop({parser: true, default: ''})
    phone: string;

    @Prop({default: ''})
    refreshToken: string;

}

export const UserSchema = SchemaFactory.createForClass(User);