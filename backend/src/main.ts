import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware';
import { requestLoggerMiddleware } from './middlewares/requestLogger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(requestLoggerMiddleware);
  app.use(errorHandlerMiddleware);
  await app.listen(Number(process.env.PORT ?? 3000), '0.0.0.0');
}

bootstrap();
