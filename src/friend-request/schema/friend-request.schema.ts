import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/user/schema/user.schema";

export type FriendRequestDocument = HydratedDocument<FriendRequest>;

@Schema({timestamps: true})
export class FriendRequest {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: User.name })
    from: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: User.name })
    to: mongoose.Types.ObjectId;

    @Prop({ type: String, maxLength: 500 })
    Message: string;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);

FriendRequestSchema.index({ from: 1, to: 1 }, { unique: true }); // Tạo chỉ mục kết hợp duy nhất trên from và to để ngăn chặn các yêu cầu kết bạn trùng lặp giữa cùng hai người dùng.
FriendRequestSchema.index({ from: 1 }); // Tạo chỉ mục trên trường from để tối ưu hóa truy vấn các yêu cầu kết bạn gửi bởi một người dùng cụ thể.
FriendRequestSchema.index({ to: 1 }); // Tạo chỉ mục trên trường to để tối ưu hóa truy vấn các yêu cầu kết bạn nhận bởi một người dùng cụ thể.