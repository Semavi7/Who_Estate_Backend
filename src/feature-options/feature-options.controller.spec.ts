import { Test, TestingModule } from '@nestjs/testing';
import { FeatureOptionsController } from './feature-options.controller';
import { FeatureOptionsService } from './feature-options.service';

describe('FeatureOptionsController', () => {
  let controller: FeatureOptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeatureOptionsController],
      providers: [FeatureOptionsService],
    }).compile();

    controller = module.get<FeatureOptionsController>(FeatureOptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
