import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/user/schema/user.schema";

export type LastMessageDocument = HydratedDocument<LastMessage>;

@Schema({timestamps: true, _id: false })
export class LastMessage {
    @Prop({ type: String,})
    _id: string;
    
    @Prop({ type: String, default: null })
    content: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    senderId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: Date, default: null })
    createdAt: Date;
}   
export const LastMessageSchema = SchemaFactory.createForClass(LastMessage);