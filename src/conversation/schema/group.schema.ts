import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/user/schema/user.schema";

export type GroupDocument = HydratedDocument<Group>;

@Schema({timestamps: true, _id: false })
export class Group {
    @Prop({ type: String, required: true, trim: true })
    name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    createdBy: mongoose.Types.ObjectId;
}
export const GroupSchema = SchemaFactory.createForClass(Group);
