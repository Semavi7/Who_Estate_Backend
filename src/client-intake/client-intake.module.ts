import { Module } from '@nestjs/common';
import { ClientIntakeService } from './client-intake.service';
import { ClientIntakeController } from './client-intake.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientIntake } from './entities/client-intake.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientIntake])],
  controllers: [ClientIntakeController],
  providers: [ClientIntakeService],
})
export class ClientIntakeModule {}
