import { Injectable, NotFoundException } from '@nestjs/common';
import { Event } from './event.entity';
import { eventSearchDto } from './eventSearch.dto';
import { eventUpdateDto } from './eventUpdate.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class EventService {
 constructor(
  @InjectRepository(Event)
  private readonly eventRepo:Repository<Event>,
){}

  async getAllEvents(): Promise<Event[]> {
    return await this.eventRepo.find();
  }
  
    async createEvent(
    name: string,
    location:string,
    category: string,
    date: Date,  
  ): Promise<Event> {
    const event = this.eventRepo.create({
      name,
      location,
      category,
      date
    });
    await this.eventRepo.save(event);
    return event;
  }

  
  async deleteEvent(id: string) :Promise<void>{
    const result=await this.eventRepo.delete(id);
    
    if(result.affected===0){
      throw new NotFoundException(`Event with is ${id} not found`)
    }

  }


  async eventSearch(eventSearchDto: eventSearchDto): Promise<Event[]>{
    const { name,location,date,category } = eventSearchDto;

    const query=this.eventRepo.createQueryBuilder('event')

    if (name) {
      query.andWhere('event.name LIKE :name',{
        name:`%${name}%`,
      })
    }
    
    if (category) {
      query.andWhere('event.category LIKE :category',{
        category:`%${category}%`,
      })
    }
    if (date) {
            query.andWhere('event.date LIKE :date',{
        date:`%${date}%`,
      })
    }
        if (location) {
            query.andWhere('event.location LIKE :location',{
        location:`%${location}%`,
      })
    }
    return await query.getMany();

  }
  async getEventById(id: string): Promise<Event> {
    const event = await this.eventRepo.findOne({where:{id}})
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async updateEvent(id: string, eventUpdatedto: eventUpdateDto): Promise<Event> {
   const event=await this.getEventById(id);
   Object.assign(event,eventUpdatedto);

   return await this.eventRepo.save(event);

  }
}
