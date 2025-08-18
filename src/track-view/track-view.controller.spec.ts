import { Test, TestingModule } from '@nestjs/testing';
import { TrackViewController } from './track-view.controller';
import { TrackViewService } from './track-view.service';

describe('TrackViewController', () => {
  let controller: TrackViewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackViewController],
      providers: [TrackViewService],
    }).compile();

    controller = module.get<TrackViewController>(TrackViewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
