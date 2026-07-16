import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { notificationChannelSeed } from './notification-channel.seed';
import { notificationPayloadSchemaSeed } from './notification-payload-schema.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  await notificationChannelSeed(dataSource);
  await notificationPayloadSchemaSeed(dataSource);
  await app.close();
  console.log('Seeds executed');
}

bootstrap();
