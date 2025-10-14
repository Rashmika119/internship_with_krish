import { Module } from '@nestjs/common';
import { ScatterController } from './scatter.controller';
import { ScatterService } from './scatter.service';
import { HttpModule } from '@nestjs/axios';
//import { MetricsModule } from '../../metrics/src/metrics.module';

@Module({
  imports: [
    HttpModule.register({
      timeout:1000
    }),
    //MetricsModule
  ],
  controllers: [ScatterController],
  providers: [ScatterService],
})
export class ScatterModule {}
