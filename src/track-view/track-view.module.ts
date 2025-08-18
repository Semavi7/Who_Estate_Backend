import { Module } from '@nestjs/common';
import { TrackViewService } from './track-view.service';
import { TrackViewController } from './track-view.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackView } from './entities/track-view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrackView])],
  controllers: [TrackViewController],
  providers: [TrackViewService],
})
export class TrackViewModule {}
