import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { swaggerSetup } from './config/swagger/swagger-setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const apiPrefix = process.env.API_PREFIX || 'api';
  const port = Number(process.env.PORT || 3000);

  app.setGlobalPrefix(apiPrefix);

  swaggerSetup(app);

  await app.listen(port, () => {
    console.log(
      `Server is running on port ${port} in ${process.env.NODE_ENV} mode`,
    );
    console.log(`API prefix: ${apiPrefix}`);
    console.log(
      `Swagger documentation: http://localhost:${port}/${apiPrefix}/docs`,
    );
  });
}
bootstrap();
