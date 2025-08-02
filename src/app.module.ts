import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureOptionsModule } from './feature-options/feature-options.module';
import { FeatureOption } from './feature-options/entities/feature-option.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileUploadModule } from './file-upload/file-upload.module';
import { PropertiesModule } from './properties/properties.module';
import { Property } from './properties/entities/property.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      useFactory: (configservice:ConfigService) => ({
        type: 'mongodb',
        entities:[FeatureOption, Property],
        synchronize:true,
        url: configservice.get<string>('MONGO_URL')
      }),
      inject:[ConfigService]
    }),
    FeatureOptionsModule,
    FileUploadModule,
    PropertiesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
