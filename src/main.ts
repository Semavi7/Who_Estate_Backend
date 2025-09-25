import { NestFactory, Reflector } from '@nestjs/core';
import * as crypto from 'crypto';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  console.log('Application bootstrap started...');
  const app = await NestFactory.create(AppModule)
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API description for my project')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document)

  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }))

  const reflector = app.get(Reflector)
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? 'https://www.deryaemlak.co' : 'http://localhost:3000' ,
    credentials: true
  })
  await app.listen(process.env.PORT ?? 3001)
}
bootstrap();

