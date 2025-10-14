import { Module } from '@nestjs/common';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import { HttpModule } from '@nestjs/axios';
//import { MetricsService } from 'apps/metrics/src/metrics.service';

@Module({
  imports: [
        HttpModule.register({
              timeout:1000
        })
  ],
  controllers: [BranchController],
  providers: [BranchService],//MetricsService],
})
export class BranchModule {}
