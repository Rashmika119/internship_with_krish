import { Controller, Get, Query } from '@nestjs/common';
import { BranchService } from './branch.service';
//import { MetricsService } from 'apps/metrics/src/metrics.service';

@Controller('v1/trips')
export class BranchController {
  constructor(private readonly branchService: BranchService,
    //private readonly metricsService: MetricsService
    ) {}

  @Get('/contextual')
  async getEventsWithHotels(
    @Query('startDestination') starttDestination:string,
    @Query('endDestination') endDestination:string,
    //when send data through a url everything treated as astring.no matter the intended type
    @Query('arriveTime') arriveTime:string

  ){
    //await this.metricsService.increment('v1');
    //getEventDest method expect Date object
    const arriveDate=new Date(arriveTime);
    return this.branchService.getEventInDestination(starttDestination,endDestination,arriveDate);
    ;
  }
}
