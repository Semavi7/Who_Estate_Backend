import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackView } from './entities/track-view.entity';
import { MongoRepository } from 'typeorm';

@Injectable()
export class TrackViewService {
  constructor(
    @InjectRepository(TrackView)
    private readonly trackViewRepository: MongoRepository<TrackView>
  ) { }

  async create(): Promise<TrackView> {
    const today = new Date().toISOString().split('T')[0]

    let track = await this.trackViewRepository.findOne({ where: { date: today } })

    if (track) {
      track.views += 1
      return this.trackViewRepository.save(track)
    }
    else {
      const newTrack = this.trackViewRepository.create({
        date: today,
        views: 1
      })
      return this.trackViewRepository.save(newTrack)
    }
  }

  async getCurrentYearStats(): Promise<{ month: string; views: number }[]> {
    const year = new Date().getFullYear()
    const collection = this.trackViewRepository.manager.getMongoRepository(TrackView)

    const result = await collection.aggregate([
      {
        $match: {
          date: { $regex: `^${year}-` } // sadece bu yılın kayıtları
        }
      },
      {
        $group: {
          _id: { $substr: ["$date", 0, 7] }, // "YYYY-MM"
          views: { $sum: "$views" },
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray()

    // Boş ayları da dolduralım
    const months = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, "0")
      const found = result.find(r => r._id === `${year}-${month}`)
      return {
        month: `${year}-${month}`,
        views: found ? found.views : 0
      }
    })

    return months
  }

  async getCurrentMonthTotalViews(): Promise<number> {
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, "0")
    const prefix = `${year}-${month}`

    const collection = this.trackViewRepository.manager.getMongoRepository(TrackView)
    const result = await collection.aggregate([
      {
        $match: {
          date: { $regex: `^${prefix}` }
        }
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" }
        }
      }
    ]).toArray()

    return result.length > 0 ? result[0].totalViews : 0
  }

}
