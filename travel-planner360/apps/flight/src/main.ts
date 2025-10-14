import { NestFactory } from '@nestjs/core';
import { FlightModule } from './flight.module';

async function bootstrap() {
  const app = await NestFactory.create(FlightModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
