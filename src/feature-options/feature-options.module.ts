import { Module } from '@nestjs/common';
import { FeatureOptionsService } from './feature-options.service';
import { FeatureOptionsController } from './feature-options.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureOption } from './entities/feature-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeatureOption])],
  controllers: [FeatureOptionsController],
  providers: [FeatureOptionsService],
})
export class FeatureOptionsModule {}
