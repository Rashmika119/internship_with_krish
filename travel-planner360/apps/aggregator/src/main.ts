import { NestFactory } from '@nestjs/core';
import { AggregatorModule } from './aggregator.module';

async function bootstrap() {
  const app = await NestFactory.create(AggregatorModule);
  await app.listen(process.env.port ?? 5000);
}
bootstrap();
