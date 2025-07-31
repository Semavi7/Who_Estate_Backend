import { Test, TestingModule } from '@nestjs/testing';
import { FeatureOptionsService } from './feature-options.service';

describe('FeatureOptionsService', () => {
  let service: FeatureOptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeatureOptionsService],
    }).compile();

    service = module.get<FeatureOptionsService>(FeatureOptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
