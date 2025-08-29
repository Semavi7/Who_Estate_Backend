import { Test, TestingModule } from '@nestjs/testing';
import { ClientIntakeController } from './client-intake.controller';
import { ClientIntakeService } from './client-intake.service';

describe('ClientIntakeController', () => {
  let controller: ClientIntakeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientIntakeController],
      providers: [ClientIntakeService],
    }).compile();

    controller = module.get<ClientIntakeController>(ClientIntakeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
