import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class ChainService {
  constructor(private readonly httpService: HttpService) { }
  private readonly logger = new Logger(ChainService.name)

  private async callService(
    hostname: string,
    port: number,
    path: string,
  ): Promise<any> {
    const url = `http://${hostname}:${port}${path}`;

    try {
      const { data } = await firstValueFrom(this.httpService.get<any>(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response?.data);
          throw 'request fails';
        })
      ))
      return data
    } catch (error) {
      console.log(`Service timeout: ${url}`);
      return 'timeout';
    }
  }
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
        const [h,m]=hotel.checkInEndTime.split(':').map(Number);
        const hotelMinutes=h*60+m;
        return {
          ...hotel,
          lateCheckIn: flightMinutes <= hotelMinutes
        }
      })

      : []
      return{
        flight:flightResult,
        hotel:hotelsWithLateCheckins,
      };
  }
  
}
