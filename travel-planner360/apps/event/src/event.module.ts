import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';

@Module({
  imports: [
    //register the datbase
    TypeOrmModule.forRoot({
          type:'sqlite',
          database:'event.sqlite',
          entities:[Event],
          synchronize:true,
        }),
        //register the repository
         TypeOrmModule.forFeature([Event])
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
