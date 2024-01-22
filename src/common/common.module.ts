import { Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { ResponseInterceptorService } from './interceptors/response-interceptor.service';
import { CommonMailService } from './notification/mail.service';

@Global()
@Module({
  providers: [CommonService, ResponseInterceptorService, CommonMailService],
  exports: [CommonService, CommonMailService],
})
export class CommonModule {}
