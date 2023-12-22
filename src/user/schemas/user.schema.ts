import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'fileUploads' })
export class User {
  _id: Types.ObjectId;

  @Prop({
    type: String,
  })
  firstName: string;

  @Prop({
    type: String,
  })
  lastName: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String })
  resetPasswordToken: string;

  @Prop({ type: String })
  resetPasswordExpiryTime: string;
}
/**
 * @ignore
 */
export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
