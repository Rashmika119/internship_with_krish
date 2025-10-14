import { NestFactory } from '@nestjs/core';
import { BranchModule } from './branch.module';

async function bootstrap() {
  const app = await NestFactory.create(BranchModule);
  await app.listen(process.env.port ?? 4010);
}
bootstrap();
