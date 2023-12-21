import { FilterQuery, Types } from 'mongoose';
import { ICommonResponse } from '../common/types';
import { UserDocument } from './schemas/user.schema';

export interface ILoginData {
  _id: Types.ObjectId;
  email: string;
  lastName: string;
  firstName: string;
  accessToken: string;
}

export type LoginResponse = Promise<ICommonResponse<ILoginData>>;

export type UserQueryObject = Partial<FilterQuery<UserDocument>>;
