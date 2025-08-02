import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { FileUploadModule } from 'src/file-upload/file-upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property]),
    FileUploadModule
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
