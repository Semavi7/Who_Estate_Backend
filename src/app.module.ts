import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureOptionsModule } from './feature-options/feature-options.module';
import { FeatureOption } from './feature-options/entities/feature-option.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      useFactory: (configservice:ConfigService) => ({
        type: 'mongodb',
        entities:[FeatureOption],
        synchronize:true,
        url: configservice.get<string>('MONGO_URL')
      }),
      inject:[ConfigService]
    }),
    FeatureOptionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
