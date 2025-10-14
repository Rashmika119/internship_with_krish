import { NestFactory } from '@nestjs/core';
import { WeatherModule } from './weather.module';
import 'dotenv/config'; 

async function bootstrap() {
  const app = await NestFactory.create(WeatherModule);
  await app.listen(process.env.port ?? 5010);
}
bootstrap();
