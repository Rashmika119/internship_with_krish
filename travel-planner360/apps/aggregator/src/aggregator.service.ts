import { Injectable, HttpException, Logger } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

import { CircuitBreaker } from './circuitBreaker';
import { AxiosError } from 'axios';


@Injectable()
export class AggregatorService {
  constructor(private readonly httpService: HttpService) { }
  private readonly logger = new Logger(AggregatorService.name)

  async fetchData(dateStr: any, endDestination: any) {
    return await this.callService('localhost', 5010, `/weather/seven-days/${dateStr}/${endDestination}`)
  }

  private async callService(hostname: string, port: number, path: string): Promise<any> {
    const url = `http://${hostname}:${port}${path}`;

    try {
      const { data } = await firstValueFrom(this.httpService.get<any>(url))
      return data
    } catch (error) {
      console.log(`Service timeout: ${url}`);
      throw error;
    }
  }

  //---------------version 1 -----------------
  //Include weather and hotel services
  //use scatter gather pattern

  async getFlightAndHotelInfo(startDestination: string, endDestination: string, departTime?: Date) {
    if (!startDestination || !endDestination || !departTime) {
      throw new HttpException('flight details are required', 400);
    }
    const flightPromise = this.callService(
      'localhost',
      3000,
      `/flight?startDestination=${startDestination}&endDestination=${endDestination}`);

    const hotelPromise = this.callService(
      'localhost',
      4000,
      `/hotel?location=${endDestination}`

    );
    const TOTATL_BUDGET = 1000;
    let flights = null;
    let hotels = null;
    let degraded = false;

    try {
      //promise.race([promise1,promise2]).If promise2 wins(the timeout),then it jumps to catch error
      const results = await Promise.race([Promise.all([flightPromise, hotelPromise]), new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), TOTATL_BUDGET))]);

      if (Array.isArray(results)) {
        [flights, hotels] = results;
      }
    } catch (error) {
      degraded = true;
      flights = await Promise.resolve(flightPromise).catch(() => null);
      hotels = await Promise.resolve(hotelPromise).catch(() => null);
    }
    ;

    return {
      flights: flights || 'no flights found',
      hotels: hotels || 'no hotels found',
      degraded
    }

  }
  //---------------version 2-----------------
  // added weather service with flight and hotel sevice
  //using scatter gather
  // circuit breaker for weather service

  async getInfoWithWeather(startDestination: string, endDestination: string, arriveTime: Date) {
    if (!startDestination || !endDestination || !arriveTime) {
      throw new HttpException('flight details are required', 400);
    }
    const parseDate=new Date(arriveTime);

    if(isNaN(parseDate.getTime())){
      throw new HttpException('Invalide date format for arriveTime',400)
    }

    const flightPromise = this.callService(
      'localhost',
      3000,
      `/flight?startDestination=${startDestination}&endDestination=${endDestination}`
    );

    const hotelPromise = this.callService(
      'localhost',
      4000,
      `/hotel?location=${endDestination}`

    );
    const dateStr = parseDate.toISOString().split('T')[0];

    //circuit breaker
    const weatherBreaker = new CircuitBreaker(async () => await this.fetchData(dateStr, endDestination),
      {
        failureThreshold: 0.5,
        requestVolumeThreshold: 20,
        cooldownTime: 30000,
        halfOpenRequests: 5,
        fallback: () => {
          return {
            summary: 'service unavailable',
            degraded: true
          }
        }
      }
    );

    const TOTATL_BUDGET = 1000;
    let flights = null;
    let hotels = null;
    let weather = null;
    let degraded = false;

    try {
      const weatherPromise = weatherBreaker.fire();

      //promise.race([promise1,promise2]).If promise2 wins(the timeout),then it jumps to catch error
      const results = await Promise.race(
        [Promise.all([flightPromise, hotelPromise, weatherPromise]), new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), TOTATL_BUDGET))]
      );

      console.log(results);
      if (Array.isArray(results)) {
        [flights, hotels, weather] = results;
      }
    } catch (error) {
      degraded = true;
      flights = await Promise.resolve(flightPromise).catch(() => null);
      hotels = await Promise.resolve(hotelPromise).catch(() => null);

      //we need this catch block,because if the circuit is open we want to show default values
      //if weather is failed or half opened,no need there catch block,bcz fallback take care of it
      weather = (await weatherBreaker.fire().catch(() => ({ summary: 'service unavailable', degraded: true })))


    }
    //when weather is down it calls the fallback. so no error throws,not catch by above catch block
    if (weather && weather.degraded === true) {
      degraded = true;
    }


    return {
      flights: flights || 'no flights found',
      hotels: hotels || 'no hotels found',
      weather: weather || 'no weather result found',
      degraded
    }



  }

  //-------------------------------version 1-----------------
  //hotels+ flight
  //get budget route flights
  //get the late chekin hotels that matches with arrive time
  //chain aggregator pattern used

  async getBudgetRoute(startDestination: string, endDestination: string, arriveTime: Date) {
    if (!startDestination || !endDestination || !arriveTime) {
      throw new HttpException('flight details are required', 400);
    }
    const flightResult: any = await this.callService(
      'localhost',
      3000,
      `/flight/getCheapFlight?startDestination=${startDestination}&endDestination=${endDestination}&arriveTime=${arriveTime.toISOString()}`
    )
    const hotelResult = await this.callService(
      'localhost',
      4000,
      `/hotel?location=${endDestination}`
    )

    const hotelsWithLateCheckins = Array.isArray(hotelResult) ?
      hotelResult.map((hotel) => {

        //the response comes in string.To get the total time,convert the response to 'date' type
        const flightArrival = new Date(flightResult.arriveTime);
        //arriveTime is in Date data type so use getUTCHours and getUTCMinutes(21:00:00)
        const flightMinutes = flightArrival.getUTCHours() * 60 + flightArrival.getUTCMinutes()

        //as the checkInEndTime is a string but not in full format dateTtime(21:04).only time.So new Date not work
        const [h, m] = hotel.checkInEndTime.split(':').map(Number);
        const hotelMinutes = h * 60 + m;
        return {
          ...hotel,
          lateCheckIn: flightMinutes <= hotelMinutes
        }
      })

      : []
    return {
      flight: flightResult,
      hotel: hotelsWithLateCheckins,
    };
  }


  //-----------------------version 1--------------------------
  //flight + hotels +events
  //get events that matches with the end destination
  //branch pattern used

  async getEventInDestination(startDestination: string, endDestination: string, arriveTime: Date) {
    if (!startDestination || !endDestination || !arriveTime) {
      throw new HttpException('flight details are required', 400);
    }
    const flightResult: any = await this.callService(
      'localhost',
      3000,
      `/flight?startDestination=${startDestination}&endDestination=${endDestination}&arriveTime=${arriveTime.toISOString()}`
    )
    const hotelResult = await this.callService(
      'localhost',
      4000,
      `/hotel?location=${endDestination}`
    )
    const coastalLocations = ['CMB', 'HMBT', 'JFN', 'TRINC', 'GLL', 'MTR']
    const isCoastal = coastalLocations.includes(endDestination);
    let eventResult: any = null

    if (isCoastal) {

      eventResult = await this.callService(
        'localhost',
        3010,
        `/event?location=${endDestination}&category=coastal`
      )


    }

    return {
      flight: flightResult,
      hotel: hotelResult,
      event: eventResult
    }
  }

}

