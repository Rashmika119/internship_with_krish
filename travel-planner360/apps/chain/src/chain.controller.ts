import { Controller, Get, Query } from '@nestjs/common';
import { ChainService } from './chain.service';
//import { MetricsService } from 'apps/metrics/src/metrics.service';

@Controller('v1/trips')
export class ChainController {
  constructor(private readonly chainService: ChainService,
      //private readonly metricsService:MetricsService
  ) {}


  @Get('/cheapest_route')
 async getChepestRouteWithHotels(
        @Query('startDestination') startDestination:string,
        @Query('endDestination') endDestination:string,
        @Query('arriveTime') arriveTime:string,
  ){
       //await this.metricsService.increment('v1')

        const arriveDate=new Date(arriveTime);
        return this.chainService.getBudgetRoute(startDestination,endDestination,arriveDate);
      }
  
}
