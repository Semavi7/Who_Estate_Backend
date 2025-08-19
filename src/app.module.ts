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
import { MessagesModule } from './messages/messages.module';
import { Message } from './messages/entities/message.entity';
import { TrackViewModule } from './track-view/track-view.module';
import { TrackView } from './track-view/entities/track-view.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      useFactory: (configservice:ConfigService) => ({
        type: 'mongodb',
        entities:[FeatureOption, Property, Message, TrackView, User],
        synchronize:true,
        url: configservice.get<string>('MONGO_URL')
      }),
      inject:[ConfigService]
    }),
    FeatureOptionsModule,
    FileUploadModule,
    PropertiesModule,
    MessagesModule,
    TrackViewModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
