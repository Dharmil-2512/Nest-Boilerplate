import { FilterQuery, Types } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { CommonResponse } from '../common/common.types';

export interface UserDetailResponseData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}
export type UserDetailModel = Promise<CommonResponse<UserDetailResponseData>>;

export interface LoginData {
  _id: Types.ObjectId;
  email: string;
  lastName: string;
  firstName: string;
  accessToken: string;
}

export type LoginResponse = Promise<CommonResponse<LoginData>>;

export type UserQueryObject = Partial<FilterQuery<UserDocument>>;
