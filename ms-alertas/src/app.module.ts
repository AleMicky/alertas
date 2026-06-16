import { join } from 'path';

import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MsAlertsModule } from './ms-alerts.module';
import { BullModule } from '@nestjs/bullmq';
import { ClsModule } from 'nestjs-cls';
import { ClsUserInterceptor } from './shared/interceptors/cls-user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
const monorepoEnvPath = join(process.cwd(), '../.env');

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
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
    MsAlertsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClsUserInterceptor,
    },
  ]
})
export class AppModule { }
