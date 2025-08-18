import { Test, TestingModule } from '@nestjs/testing';
import { TrackViewService } from './track-view.service';

describe('TrackViewService', () => {
  let service: TrackViewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackViewService],
    }).compile();

    service = module.get<TrackViewService>(TrackViewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
