import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Description - Entry File Of Nest Application
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT);
}
void bootstrap();
