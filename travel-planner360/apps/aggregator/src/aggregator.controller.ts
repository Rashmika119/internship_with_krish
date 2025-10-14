import { Controller, Get, Query } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';

//import { MetricsService } from 'apps/metrics/src/metrics.service';


@Controller()
export class AggregatorController {
  private v1Count = 0;
  private v2Count = 0;
  constructor(private readonly aggregatorService: AggregatorService,
    //private readonly metricsService:MetricsService
  ) { }

  //-----------------------------version 1-------------------
  //flight + hotel with scatter gather patter

  @Get('v1/trips/search')
  async getHotelInfo(
    @Query('startDestination') startDestination: string,
    @Query('endDestination') endDestination: string,
    @Query('arriveTime') arriveTime: string,
  ) {

    this.v1Count++;
    

    //convert date string to date as @query decorator gives strings
    const arriveDate = new Date(arriveTime);
    return this.aggregatorService.getFlightAndHotelInfo(startDestination, endDestination, arriveDate);
  }


  //--------------------version 2-------------------
  //weather + flight + hotel with scatter gather

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
    return this.aggregatorService.getInfoWithWeather(startDestination, endDestination, arriveDate);
  }


  //---------------------version 1----------------------
  //hotels + flight
  //budget route find and the late checkin hotels checking
  //chain pattern

  @Get('v1/trips/cheapest_route')
 async getChepestRouteWithHotels(
        @Query('startDestination') startDestination:string,
        @Query('endDestination') endDestination:string,
        @Query('arriveTime') arriveTime:string,
  ){
       //await this.metricsService.increment('v1')

        const arriveDate=new Date(arriveTime);
        return this.aggregatorService.getBudgetRoute(startDestination,endDestination,arriveDate);
      }

  //---------------------------version 1--------------------------
  //flight + hotels + events
  //get events accoring to the destination
  //branch aggregator pattern

  @Get('v1/trips/contextual')
  async getEventsWithHotels(
    @Query('startDestination') starttDestination:string,
    @Query('endDestination') endDestination:string,
    //when send data through a url everything treated as astring.no matter the intended type
    @Query('arriveTime') arriveTime:string

  ){
    
    //getEventDest method expect Date object
    const arriveDate=new Date(arriveTime);
    return this.aggregatorService.getEventInDestination(starttDestination,endDestination,arriveDate);
    ;
  }
}
