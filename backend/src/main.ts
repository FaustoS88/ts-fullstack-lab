import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable CORS so the React frontend can call this API
  app.enableCors(); // ← allow cross-origin requests

  // Increase JSON payload limit to 50 MB
  app.use(json({ limit: '50mb' })); // ← default is ~100 KB :contentReference[oaicite:3]{index=3}

  // Increase URL-encoded payload limit to 50 MB
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // 2. Apply global validation with whitelist and forbid unknown props
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw when unknown properties are present
    }),
  ); // ← mounts ValidationPipe globally

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
