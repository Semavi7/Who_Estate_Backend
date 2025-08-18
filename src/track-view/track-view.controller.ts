import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrackViewService } from './track-view.service';

@Controller('track-view')
export class TrackViewController {
  constructor(private readonly trackViewService: TrackViewService) {}

  @Post()
  create() {
    return this.trackViewService.create();
  }

  
}
