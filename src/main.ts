import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform:true,
    whitelist:true
  }))

  const reflector = app.get(Reflector)
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

  app.enableCors()
  await app.listen(process.env.PORT ?? 3001)
}
bootstrap();
