import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/user/schema/user.schema";

export type ParticipantDocument = HydratedDocument<Participant>;

@Schema({timestamps: true, _id: false})
export class Participant {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
    userId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: Date, default: Date.now })
    joinedAt: Date;


}
export const ParticipantSchema = SchemaFactory.createForClass(Participant);
