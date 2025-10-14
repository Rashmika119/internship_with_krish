import { Module } from '@nestjs/common';
import { ChainController } from './chain.controller';
import { ChainService } from './chain.service';
import { HttpModule } from '@nestjs/axios';
//import { MetricsService } from 'apps/metrics/src/metrics.service';

@Module({
  imports: [
    HttpModule.register({
          timeout:1000
        })
  ],
  controllers: [ChainController],
  providers: [ChainService],//MetricsService],
})
export class ChainModule {}
