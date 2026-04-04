import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ENV } from './constants';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: ENV.frontendOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  await app.listen(ENV.port);
}

bootstrap();
