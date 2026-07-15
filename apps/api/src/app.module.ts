import { join } from 'path';

import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api.module';
import { ClsModule } from 'nestjs-cls';
import { ClsUserInterceptor } from './shared/interceptors/cls-user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
// Cubre cwd en raíz del monorepo, apps/ o apps/api
const envFilePaths = [
  join(process.cwd(), '.env'),
  join(process.cwd(), '../.env'),
  join(process.cwd(), '../../.env'),
];

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
      envFilePath: envFilePaths,
    }),
    DatabaseModule,
    ApiModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClsUserInterceptor,
    },
  ]
})
export class AppModule { }
