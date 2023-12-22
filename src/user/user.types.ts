import { Types } from 'mongoose';
import { CommonResponse } from 'src/common/common.types';

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
  token: string;
}

export type LoginResponse = Promise<CommonResponse<LoginData>>;
