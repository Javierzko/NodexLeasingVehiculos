import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en los DTOs
      forbidNonWhitelisted: true, // Lanza error si envían campos no permitidos
      transform: true, // Transforma automáticamente los tipos de datos recibidos
    }),
  );

app.enableCors();


  await app.listen(5001);
}
bootstrap();