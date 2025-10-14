import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { Hotel } from './hotel.entityl';
import { hotelSearchDto } from './hotelSearch.dto';
import { hotelUpdateDto } from './hotelUpdate.dto';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

    @Get()
    getAllHotels(@Query() param:hotelSearchDto){
        if(Object.keys(param).length){
            return this.hotelService.hotelSearch(param);
        }else{
            return this.hotelService.getAllHotels();
        }
        
    }

    @Post()
    createHotel(
        @Body('name') name:string,
        @Body('location') location:string,
        @Body('rating') rating:number,
        @Body('pricePerNight') pricePerNight:number,
        @Body('checkInEndTime') checkInEndTime:string
    ){

        return this.hotelService.createHotel(name,location,rating,pricePerNight,checkInEndTime)
    }

    @Get('/:id')
    getHotelById(@Param() id:string){
      return this.hotelService.getHotelById(id);
    }

    @Put('/:id')
    updateHotel(
      @Param() id:string,
      @Body() updatedData: hotelUpdateDto
    ){
      const updatedHotel=this.hotelService.updateHotel(id,updatedData);
      return updatedHotel
    }

    @Delete('/:id')
    deleteHotel(
      @Param() id:string
    ){
      this.hotelService.deleteHotel(id)
    }
  }
    
