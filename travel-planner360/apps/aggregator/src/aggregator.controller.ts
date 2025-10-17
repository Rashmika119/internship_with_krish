import { Controller, Get, Query } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';




@Controller()
export class AggregatorController {

  constructor(private readonly aggregatorService: AggregatorService,
   
  ) { }

  //-----------------------------version 1-------------------
  //flight + hotel with scatter gather patter

  @Get('v1/trips/search')
  async getHotelInfo(
    @Query('startDestination') startDestination: string,
    @Query('endDestination') endDestination: string,
    @Query('arriveTime') departTime?: string,
  ) {

    
   const departDate = departTime ? new Date(departTime) : undefined;
    return this.aggregatorService.getFlightAndHotelInfo(startDestination, endDestination, departDate);
  }


  //--------------------version 2-------------------
  //weather + flight + hotel with scatter gather

  @Get('v2/trips/search')
  async getHotelInfoWithWeather(
    @Query('startDestination') startDestination: string,
    @Query('endDestination') endDestination: string,
    @Query('arriveTime') arriveTime: string,
  ) {
  
   
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
