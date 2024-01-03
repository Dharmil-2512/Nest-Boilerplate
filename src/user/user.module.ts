import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Schema } from 'mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserDocument, userSchema } from './schemas/user.schema';
import { CommonService } from '../common/common.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        imports: [CommonModule],
        name: User.name,
        useFactory: (commonService: CommonService): Schema<User> => {
          const schema = userSchema;
          schema.pre('save', async function (next) {
            if (!this.isModified('password')) {
              return next();
            }
            this.password = await commonService.hashPassword(this.password);
            return next();
          });
          schema.method('validatePassword', async function (this: UserDocument, password: string): Promise<boolean> {
            const isPasswordValid = await commonService.comparePassword(this.password, password);
            return isPasswordValid;
          });
          return schema;
        },
        inject: [CommonService],
      },
    ]),
    CommonModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports: [UserService],
})
export class UserModule {}
