import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Metrics } from './metrics.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
              type:'sqlite',
              database:'metric.sqlite',
              entities:[Metrics],
              synchronize:true,
            }),
            TypeOrmModule.forFeature([Metrics])
  ],
  controllers: [MetricsController],
  providers: [MetricsService],
  exports:[MetricsService]
})
export class MetricsModule {}
