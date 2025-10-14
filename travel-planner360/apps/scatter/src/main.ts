import { NestFactory } from '@nestjs/core';
import { ScatterModule } from './scatter.module';

async function bootstrap() {
  const app = await NestFactory.create(ScatterModule);
  await app.listen(process.env.port ?? 5000);
}
bootstrap();
