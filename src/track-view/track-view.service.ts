import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackView } from './entities/track-view.entity';
import { MongoRepository } from 'typeorm';

@Injectable()
export class TrackViewService {
  constructor(
    @InjectRepository(TrackView)
    private readonly trackViewRepository : MongoRepository<TrackView>
  ){}

  async create() : Promise<TrackView> {
    const today = new Date().toISOString().split('T')[0]

    let track = await this.trackViewRepository.findOne({ where: { date: today } })

    if(track){
      track.views +=1
      return this.trackViewRepository.save(track)
    }
    else{
      const newTrack = this.trackViewRepository.create({
        date: today,
        views: 1
      })
      return this.trackViewRepository.save(newTrack)
    }
  }

  
}
