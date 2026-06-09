import { join } from 'path';

import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MsAlertsModule } from './ms-alerts.module';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './infrastructure/auth/auth.module';

const monorepoEnvPath = join(process.cwd(), '../.env');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [monorepoEnvPath, join(process.cwd(), '.env')],
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? 6379),
      },
    }),
    DatabaseModule,
    AuthModule,
    MsAlertsModule,
  ],
})
export class AppModule {}
