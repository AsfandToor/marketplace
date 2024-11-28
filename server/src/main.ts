import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    cors: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Marketplace API')
    .setDescription('The market API description')
    .setVersion('1.0')
    .addTag('marketplace')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Enable CORS
  app.enableCors();

  // Enable JSON body parsing
  app.useBodyParser('json', { limit: '50mb' });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
