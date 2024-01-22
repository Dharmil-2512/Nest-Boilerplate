import { Global, Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { CommonModule } from '../common/common.module';
import { CommonService } from '../common/common.service';
import { User, UserDocument, userSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Global()
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
          schema.method(
            'validatePassword',
            async function (
              this: UserDocument,
              password: string,
            ): Promise<boolean> {
              const isPasswordValid = await commonService.comparePassword(
                this.password,
                password,
              );
              return isPasswordValid;
            },
          );
          return schema;
        },
        inject: [CommonService],
      },
    ]),
    forwardRef(() => CommonModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
