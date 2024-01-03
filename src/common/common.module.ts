import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonMailService } from './notification/mail.service';
import { ResponseInterceptorService } from './interceptors/response-interceptor.service';

@Module({
  providers: [CommonService, ResponseInterceptorService, CommonMailService],
  exports: [CommonService, CommonMailService],
})
export class CommonModule {}
