import { NestFactory } from '@nestjs/core';
import { ChainModule } from './chain.module';

async function bootstrap() {
  const app = await NestFactory.create(ChainModule);
  await app.listen(process.env.port ?? 6000);
}
bootstrap();
