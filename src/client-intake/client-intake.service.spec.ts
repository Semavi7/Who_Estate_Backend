import { Test, TestingModule } from '@nestjs/testing';
import { ClientIntakeService } from './client-intake.service';

describe('ClientIntakeService', () => {
  let service: ClientIntakeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientIntakeService],
    }).compile();

    service = module.get<ClientIntakeService>(ClientIntakeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
