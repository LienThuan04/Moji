import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/user/schema/user.schema";

export type FriendDocument = HydratedDocument<Friend>;

@Schema({timestamps: true})
export class Friend {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, trim: true, ref: User.name })
    userA: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, trim: true, ref: User.name })
    userB: mongoose.Types.ObjectId;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);

FriendSchema.pre<FriendDocument>('save', async function (next) {
    const a = this.userA.toString();
    const b = this.userB.toString();
    if (a < b) { // Sắp xếp theo thứ tự tăng dần
        this.userA = new mongoose.Types.ObjectId(a);
        this.userB = new mongoose.Types.ObjectId(b);
    };
     next
});

FriendSchema.index({ userA: 1, userB: 1 }, { unique: true }); // Đảm bảo rằng mỗi cặp bạn bè là duy nhất và không bị trùng lặp.