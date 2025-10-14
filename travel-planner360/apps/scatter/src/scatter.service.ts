import { Injectable, HttpException, Logger } from '@nestjs/common';
import http from "http";
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { CircuitBreaker } from './circuitBreaker';


@Injectable()
export class ScatterService {
  constructor(private readonly httpService: HttpService) { }
  private readonly logger = new Logger(ScatterService.name)

  async fetchData(dateStr: any, endDestination: any) {
    return await this.callService('localhost', 5010,`/weather/seven-days/${dateStr}/${endDestination}`)
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

  async getFlightAndHotelInfo(startDestination: string, endDestination: string, departTime: Date) {
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

  async getInfoWithWeather(startDestination: string, endDestination: string, arriveTime: Date) {
    if (!startDestination || !endDestination || !arriveTime) {
      throw new HttpException('flight details are required', 400);
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
    const dateStr = new Date(arriveTime).toISOString().split('T')[0];

    //circuit breaker
    const weatherBreaker = new CircuitBreaker(async () => await this.fetchData(dateStr, endDestination),
      {
        failureThreshold:0.5,
        requestVolumeThreshold:20,
        cooldownTime:30000,
        halfOpenRequests:5,
        fallback: () => {
          return {
            date:'unavailable',
            location:'unavalable',
            minTemp:'unavailable',
            maxTemp:'unavailable',
            condition:'unavailable',
            degraded:true
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
      const weatherPromise=weatherBreaker.fire();

      //promise.race([promise1,promise2]).If promise2 wins(the timeout),then it jumps to catch error
      const results = await Promise.race(
        [Promise.all([flightPromise, hotelPromise, weatherPromise]), new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), TOTATL_BUDGET))]
      );

      console.log("----------", results)

      if (Array.isArray(results)) {
        [flights, hotels, weather] = results;
      }
    } catch (error) {
      degraded = true;
      flights = await Promise.resolve(flightPromise).catch(() => null);
      hotels = await Promise.resolve(hotelPromise).catch(() => null);
      weather = (await weatherBreaker.fire().catch(() => ({ date:'unavailable',location:'unavalable',minTemp:'unavailable',maxTemp:'unavailable',condition:'unavailable',degraded:true})))
    }


    return {
      flights: flights || 'no flights found',
      hotels: hotels || 'no hotels found',
      weather: weather || 'no weather result found',
      degraded
    }

  

  }
}

