import { Module } from '@nestjs/common';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './hotel.entityl';



@Module({
  imports: [
        TypeOrmModule.forRoot({
          type:'sqlite',
          database:'hotel.sqlite',
          entities:[Hotel],
          synchronize:true,
        }),
        TypeOrmModule.forFeature([Hotel])
    
  ],
  controllers: [HotelController],
  providers: [HotelService],
})
export class AppModule {}
