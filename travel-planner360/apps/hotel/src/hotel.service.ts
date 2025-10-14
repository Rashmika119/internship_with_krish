import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './hotel.entityl';
import { Repository } from 'typeorm';
import { hotelSearchDto } from './hotelSearch.dto';
import { hotelUpdateDto } from './hotelUpdate.dto';

@Injectable()
export class HotelService {

  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepo: Repository<Hotel>,
  ) { }

  async getAllHotels(): Promise<Hotel[]> {
    return await this.hotelRepo.find();
  }
  async createHotel(
    name: string,
    location: string,
    rating: number,
    pricePerNight: number,
    checkInEndTime: string
  ): Promise<Hotel> {
    
    const hotel = this.hotelRepo.create({
      name,
      location,
      rating,
      pricePerNight,
      checkInEndTime
    });
    await this.hotelRepo.save(hotel);
    return hotel;
  }


  async deleteHotel(id: string): Promise<void> {
    const result = await this.hotelRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Hotel with is ${id} not found`)
    }

  }


  async hotelSearch(hotelSearchDto: hotelSearchDto): Promise<Hotel[]> {
    const { name, location, rating, pricePerNight,checkInEndTime } = hotelSearchDto;

    const query = this.hotelRepo.createQueryBuilder('hotel')

    if (name) {
      query.andWhere('hotel.name LIKE :name', {
        name: `%${name}%`,
      })
    }
    if (location) {
      query.andWhere('hotel.location LIKE :location', {
        location: `%${location}%`,
      })
    }

    if (rating) {
      query.andWhere('hotel.rating LIKE :rating', {
        rating: `%${rating}%`,
      })
    }
    if (pricePerNight) {
      query.andWhere('hotel.pricePerNight LIKE :pricePerNight', {
        pricePerNight: `%${pricePerNight}%`,
      })
    }
    if (checkInEndTime) {
      query.andWhere('hotel.checkInEndTime LIKE :checkInEndTime', {
        checkInEndTime: `%${checkInEndTime}%`,
      })
    }
    return await query.getMany();

  }
  async getHotelById(id: string): Promise<Hotel> {
    const hotel = await this.hotelRepo.findOne({ where: { id } })
    if (!hotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }
    return hotel;
  }

  async updateHotel(id: string, hotelUpdatedto: hotelUpdateDto): Promise<Hotel> {
    const hotel = await this.getHotelById(id);
    Object.assign(hotel, hotelUpdatedto);

    return await this.hotelRepo.save(hotel);

  }
}

