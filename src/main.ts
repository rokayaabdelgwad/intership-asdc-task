import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cors from 'cors';
import { IoAdapter } from '@nestjs/platform-socket.io';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('CRUD operations for a User')
  .setDescription('The user API description')
  .setVersion('1.0')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('intership-asdc-task3/swagger-docs', app, document);
  
app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))
  await app.listen(3001);
  app.enableCors();
	app.use(cors());
  app.useWebSocketAdapter(new IoAdapter(app));
}

bootstrap();
