import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { eventSearchDto } from './eventSearch.dto';
import { eventUpdateDto } from './eventUpdate.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
    getAllEvents(@Query() param: eventSearchDto) {
      if (Object.keys(param).length) {
        return this.eventService.eventSearch(param);
      } else {
        return this.eventService.getAllEvents();
      }
  
    }
      @Get('/:id')
    getEventById(@Param('id') id: string) {
      return this.eventService.getEventById(id);
    }
  
    @Post()
    createEvent(
      @Body('name') name: string,
      @Body('location') location: string,
      @Body('category') category: string,
      @Body('date') date: Date,
     
    ) {
      return this.eventService.createEvent(name, location,category, date)
    }
  
  
  
    @Put('/:id')
    updateEvent(
      @Param() id: string,
      @Body() updatedData: eventUpdateDto
    ) {
      const updatedEvent = this.eventService.updateEvent(id, updatedData);
      return updatedEvent
    }
  
    @Delete('/:id')
    deleteEvent(
      @Param() id: string
    ) {
      this.eventService.deleteEvent(id)
    }
  
}
