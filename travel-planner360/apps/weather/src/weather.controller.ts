import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { weatherSearchDto } from './weatherSearch.dto';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) { }

  @Get()
  getAllWeather(@Query() param: weatherSearchDto) {
    if (Object.keys(param).length) {
      return this.weatherService.weatherSearch(param);
    } else {
      return this.weatherService.getAllWeatherConditions();
    }
  }

  @Post()
  addWeatherCOndition(
    @Body('date') date: Date,
    @Body('location') location: string,
    @Body('tempMax') tempMax: number,
    @Body('tempMin') tempMin: number,
    @Body('condition') condition: string
  ) {

    return this.weatherService.createWeather(date, location, tempMax, tempMin, condition)
  }

  @Get('/:location')
  getWeatherByLocation(@Param() location: string) {
    return this.weatherService.getWeatherByLocation(location);
  }
  @Get('/seven-days/:date/:location')
  getSeventDayForcast(@Param('date') date: string, @Param('location') location: string) {
    const delay:number = Number(process.env.WEATHER_DELAY_MS) 
    const startDate = new Date(date);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve( this.weatherService.getWeatherForSevenDays(startDate, location));
      }, delay);
    });
  }

  @Delete('/:location')
  deleteWeather(
    @Param() location: string
  ) {
    this.weatherService.deleteWeather(location)
  }
}
