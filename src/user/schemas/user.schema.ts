import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'user' })
export class User {
  _id: Types.ObjectId;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  firstName: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  lastName: string;

  @Prop({ type: SchemaTypes.Date, required: true })
  dob: Date;

  @Prop({ type: SchemaTypes.String, required: true })
  email: string;

  @Prop({ type: SchemaTypes.String, required: true, select: false })
  password: string;

  @Prop({ type: SchemaTypes.Boolean, default: false })
  emailVerified: boolean;

  validatePassword: (password: string) => Promise<boolean>;
}
/**
 * @ignore
 */
export const userSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
