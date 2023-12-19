import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import env from './common/configs/environments.config';

/**
 * Description - Entry File Of Nest Application
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(env.PORT);
}
void bootstrap();
