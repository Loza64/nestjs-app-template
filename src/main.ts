import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import CorsOrigin from './common/models/cors.config';
import { ForbiddenException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filter/http.exception.filter';
import { TypeOrmExceptionFilter } from './filter/typeorm.exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const allowedOrigins = configService
    .get<string>('CORS_ORIGINS', '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  const originChecker: CorsOrigin = (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
      throw new ForbiddenException(`origin ${origin} not allowed`);
    }
  };

  app.enableCors({
    origin: originChecker,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter(), new TypeOrmExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
        exposeDefaultValues: true,
      },
    }),
  );

  app.setGlobalPrefix('api');

  if (configService.get<string>('NODE_ENV') === 'develop') {
    const config = new DocumentBuilder()
      .setTitle('nest-app-template')
      .setDescription('Documentación de la API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
}
void bootstrap();
