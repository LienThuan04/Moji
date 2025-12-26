import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/user/schema/user.schema";

export type SessionDocument = HydratedDocument<Session>;

@Schema({timestamps: true})
export class Session {
    @Prop({ required: true, ref: User.name, type: mongoose.Schema.Types.ObjectId, index: true, unique: true })
    userId: mongoose.Types.ObjectId; // Reference to User

    @Prop({ required: true, type: String, unique: true })
    refreshToken: string;

    @Prop({ required: true, type: Date })
    expiresAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
SessionSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });// auto delete expired sessions after expiresAt