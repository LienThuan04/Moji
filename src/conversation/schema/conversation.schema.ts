import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Participant, ParticipantSchema } from "./participant.schema";
import { Group, GroupSchema } from "./group.schema";
import { User } from "src/user/schema/user.schema";
import { LastMessage, LastMessageSchema } from "./lastMessage.schema";

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({timestamps: true})
export class Conversation {
    @Prop({ type: String, enum: ['direct', 'group'], required: true })
    type: string;

    @Prop({ type:[ParticipantSchema], required: true })
    participants: [Participant];

    @Prop({ type: GroupSchema, required: false })
    group: Group;

    @Prop({ type: Date })
    lastMessageAt: Date;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name })
    seenby: mongoose.Schema.Types.ObjectId[];

    @Prop({ type: LastMessageSchema, default: null })
    lastMessage: LastMessage;

    @Prop({ type: Map, of: Number, default: {} })
    unreadCounts: Map<any , any>;

}
export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.index({ 
    lastMessageAt: -1,
    "participants.userId": 1, // Tạo chỉ mục kết hợp trên trường participants.userId để tối ưu hóa truy vấn cuộc trò chuyện theo người tham gia.
 }); // Tạo chỉ mục trên trường lastMessageAt để tối ưu hóa truy vấn cuộc trò chuyện theo thời gian của tin nhắn cuối cùng.
