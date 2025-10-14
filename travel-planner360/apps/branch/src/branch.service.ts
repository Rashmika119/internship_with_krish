import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class BranchService {
constructor(private readonly httpService: HttpService) { }
  private readonly logger = new Logger(BranchService.name)

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
    const coastalLocations=['CMB','HMBT','JFN','TRINC','GLL','MTR']
    const isCoastal=coastalLocations.includes(endDestination);
    let eventResult:any=null

    if(isCoastal){
      
      eventResult=await this.callService(
        'localhost',
        3010,
        `/event?location=${endDestination}&category=coastal`
      )

      
    }

    return{
      flight:flightResult,
      hotel:hotelResult,
      event:eventResult
    }
}
}