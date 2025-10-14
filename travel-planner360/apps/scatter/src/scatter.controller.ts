import { Controller, Get, Query } from '@nestjs/common';
import { ScatterService } from './scatter.service';
//import { MetricsService } from 'apps/metrics/src/metrics.service';


@Controller()
export class ScatterController {
  private v1Count = 0;
  private v2Count = 0;
  constructor(private readonly scatterService: ScatterService,
    //private readonly metricsService:MetricsService
  ) { }

  @Get('v1/trips/search')
  async getHotelInfo(
    @Query('startDestination') startDestination: string,
    @Query('endDestination') endDestination: string,
    @Query('arriveTime') arriveTime: string,
  ) {

    this.v1Count++;
    //await this.metricsService.increment('v1');
    //convert date string to date as @query decorator gives strings
    const arriveDate = new Date(arriveTime);
    return this.scatterService.getFlightAndHotelInfo(startDestination, endDestination, arriveDate);
  }


  //--------------------version 2-------------------

  @Get('v2/trips/search')
  async getHotelInfoWithWeather(
    @Query('startDestination') startDestination: string,
    @Query('endDestination') endDestination: string,
    @Query('arriveTime') arriveTime: string,
  ) {
    this.v2Count++;
    //await this.metricsService.increment('v2');
    //convert date string to date as @query decorator gives strings
    const arriveDate = new Date(arriveTime);
    return this.scatterService.getInfoWithWeather(startDestination, endDestination, arriveDate);
  }
}
