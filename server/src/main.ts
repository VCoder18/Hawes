import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ENV } from './constants';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: ENV.frontendOrigin,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // acts as a security mitigation
      transform: true,
    }),
  );
  await app.listen(ENV.port);
}

bootstrap();
