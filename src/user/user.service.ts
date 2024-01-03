import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery, UpdateWriteOpResult } from 'mongoose';
import { CreateUserDto } from '../auth/dtos/create.user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { UserQueryObject } from './types';

/**
 * Description - User service
 */
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  /**
   * Description - Create User common function
   * @param createUserDto CreateUserDto
   * @returns User
   */
  async createUser(userData: Partial<CreateUserDto>): Promise<Partial<UserDocument>> {
    return this.userModel.create(userData);
  }

  /**
   * Description - Get user common function
   * @param query UserQueryObject
   * @returns User
   */
  async getUser(query: UserQueryObject, shouldGetPassword = false): Promise<UserDocument> {
    const queryBuilder = this.userModel.findOne(query);
    return shouldGetPassword ? queryBuilder.select('+password') : queryBuilder.exec();
  }

  /**
   * Description - Get user json common function
   * @param query UserQueryObject
   * @returns User
   */
  async getUserJson(query: UserQueryObject, select: object = {}): Promise<UserDocument> {
    return this.userModel.findOne(query, select).lean();
  }

  /**
   * Description - update user common function
   * @param filterQuery UserQueryObject
   * @param updateQuery UpdateUserQuery
   * @returns UpdateWriteOpResult
   */
  async updateUser(
    filterQuery: UserQueryObject,
    updateQuery: Partial<UpdateQuery<UserDocument>>,
  ): Promise<UpdateWriteOpResult> {
    return this.userModel.updateOne(filterQuery, updateQuery, { new: true });
  }
}
