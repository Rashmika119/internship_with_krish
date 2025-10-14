import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Metrics } from './metrics.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(Metrics)
    private readonly metricsRepo:Repository<Metrics>
  ){}

  async increment(version:string){
    let counter=await this.metricsRepo.findOne({where:{version}})
    if(!counter){
      counter=this.metricsRepo.create({version,count:1});
    }else{
      counter.count +=1;
    }
    await this.metricsRepo.save(counter)
  }

  async getCounters(){
    return this.metricsRepo.find();
    
  }
}
