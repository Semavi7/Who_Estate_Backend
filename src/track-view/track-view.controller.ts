import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrackViewService } from './track-view.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('track-view')
export class TrackViewController {
  constructor(private readonly trackViewService: TrackViewService) {}

  @Post()
  @Public()
  create() {
    return this.trackViewService.create();
  }

  @Get()
  @Public()
  getCurrentYearStats() {
    return this.trackViewService.getCurrentYearStats()
  }

  @Get('month')
  @Public()
  getCurrentMonthTotalViews() {
    return this.trackViewService.getCurrentMonthTotalViews()
  }

  
}
