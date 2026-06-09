import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { severityLevelSeed } from './severity-level.seed';
import { notificationChannelSeed } from './notification-channel.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);

  await severityLevelSeed(dataSource);

  await notificationChannelSeed(dataSource);

  await app.close();
  console.log('Seeds executed');
}

bootstrap();
