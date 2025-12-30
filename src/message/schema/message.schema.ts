import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/user/schema/user.schema";

export type MessageDocument = HydratedDocument<Message>;
@Schema({timestamps: true})
export class Message {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: '', required: true, index: true})
    conversationId: mongoose.Schema.Types.ObjectId;

    @Prop({type: mongoose.Schema.Types.String, required: true, ref: User.name})
    senderId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: String, trim: true })
    content: string;

    @Prop({ type: String })
    imgUrl: string;


}
export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ conversationId: 1, createdAt: -1 }); // Tạo chỉ mục kết hợp trên conversationId và createdAt để tối ưu hóa truy vấn tin nhắn theo cuộc trò chuyện và sắp xếp theo thời gian tạo.
