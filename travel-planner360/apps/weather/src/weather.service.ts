import { Injectable, NotFoundException } from '@nestjs/common';
import { Weather } from './weather.entity';
import { Between, Repository } from 'typeorm';
import { weatherSearchDto } from './weatherSearch.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(Weather)
    private readonly weatherRepo: Repository<Weather>,
  ) { }
  async getAllWeatherConditions(): Promise<Weather[]> {
    return await this.weatherRepo.find();
  }
  async createWeather(
    date: Date,
    location: string,
    tempMin: number,
    tempMax: number,
    condition: string
  ): Promise<Weather> {

    const weather = this.weatherRepo.create({
      date,
      location,
      tempMax,
      tempMin,
      condition
    });
    await this.weatherRepo.save(weather);
    return weather;
  }

  //get weather forcast for next 7 days from start date
  async getWeatherForSevenDays(startDate: Date, location: string): Promise<Weather[]> {
    const delay=Number(process.env.WEATHER_DELAY_MS) || 0;
    const failRate=Number(process.env.WEATHER_FAIL_RATE) || 0;

    if(delay>0){
      console.log("delay happens")
      await new Promise(res=>setTimeout(res,delay));
    }

    if(0.6 < failRate){
      console.log("random failure generated");
      throw new Error('Simulated weather failure');
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    //get a copy of original start date so the original one dont want to change
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);


    return this.weatherRepo.find({
      where: {
        location,
        date: Between(start, end),
      },
    });

  }


  async deleteWeather(location: string): Promise<void> {
    const result = await this.weatherRepo.delete(location);

    if (result.affected === 0) {
      throw new NotFoundException(`Weather for location, ${location} is not found`)
    }

  }


  async weatherSearch(weatherSearchDto: weatherSearchDto): Promise<Weather[]> {
    const { date, location, condition } = weatherSearchDto;

    const query = this.weatherRepo.createQueryBuilder('weather')

    if (date) {
      query.andWhere('weather.date LIKE :date', {
        date: `%${date}%`,
      })
    }
    if (location) {
      query.andWhere('weather.location LIKE :location', {
        location: `%${location}%`,
      })
    }

    if (condition) {
      query.andWhere('weather.condition LIKE :condition', {
        condition: `%${condition}%`,
      })
    }
    return await query.getMany();

  }
  async getWeatherByLocation(location: string): Promise<Weather> {
    const weather = await this.weatherRepo.findOne({ where: { location } })
    if (!weather) {
      throw new NotFoundException(`Weather in ${weather} ,is not found`);
    }
    return weather;
  }

}
