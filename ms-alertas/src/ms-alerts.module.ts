import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { BullModule } from '@nestjs/bullmq';
// Entities
import {
  NotificationChannelEntity,
  NotificationChannelProviderEntity,
  NotificationPayloadSchemaEntity,
  NotificationRequestEntity,
  NotificationRecipientEntity,
  NotificationAttachmentEntity,
  NotificationDeliveryEntity,
  NotificationDeliveryAttemptEntity,
  NotificationRequestAuditEntity,
  ClientSystemEntity,
  ClientSystemTokenEntity,
  RoleEntity,
  UserEntity,
  LoginAuditEntity,
} from './infrastructure/typeorm/entities';
// Services
import {
  NotificationChannelsService,
  NotificationChannelProvidersService,
  NotificationPayloadSchemasService,
  NotificationRequestsService,
  NotificationRequestProcessor,
  NotificationRequestAuditService,
  NotificationCallbacksService,
  ClientSystemService,
  ClientSystemTokenService,
  NotificationService,
  RoleService,
  AuthService,
  UserService,
  RefreshTokenService,
} from './app/services';
// Repositories
import {
  NotificationChannelRepository,
  NotificationChannelProviderRepository,
  NotificationPayloadSchemaRepository,
  NotificationRequestRepository,
  NotificationRecipientRepository,
  NotificationAttachmentRepository,
  NotificationDeliveryRepository,
  NotificationDeliveryAttemptRepository,
  NotificationRequestAuditRepository,
  ClientSystemRepository,
  ClientSystemTokenRepository,
  RoleRepository,
  UserRepository,
  LoginAuditRepository,
} from './domain/repositories';
// Controllers
import {
  NotificationChannelsController,
  NotificationChannelProvidersController,
  NotificationPayloadSchemasController,
  NotificationRequestsController,
  NotificationCallbacksController,
  ClientSystemController,
  TestN8nController,
  RoleController,
  AuthController,
  UserController,
} from './presentation/controllers';
// Repositories
import {
  NotificationChannelTypeormRepository,
  NotificationChannelProviderTypeormRepository,
  NotificationPayloadSchemaTypeormRepository,
  NotificationRequestTypeormRepository,
  NotificationRecipientTypeormRepository,
  NotificationAttachmentTypeormRepository,
  NotificationDeliveryTypeormRepository,
  NotificationDeliveryAttemptTypeormRepository,
  NotificationRequestAuditTypeormRepository,
  ClientSystemTypeormRepository,
  ClientSystemTokenTypeormRepository,
  RoleTypeormRepository,
  UserTypeormRepository,
  LoginAuditTypeormRepository,
} from './infrastructure/repositories';
import { N8nClient } from './infrastructure/integrations/n8n/n8n.client';
import { TokenGeneratorService } from './infrastructure/security/token-generator.service';
import { ClientSystemAuthGuard } from './shared/guards/client-system-auth.guard';
import { PassportModule } from '@nestjs/passport';
import {
  JwtAuthGuard,
  JwtStrategy,
  PasswordService,
  RolesGuard,
} from './infrastructure/security';
import { NOTIFICATION_REQUEST_QUEUE } from './app/queues/notification-request.queue';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST') ?? 'localhost',
          port: Number(configService.get<string>('REDIS_PORT') ?? 6379),
          password: configService.get<string>('REDIS_PASSWORD') || undefined,
        },
      }),
    }),
    BullModule.registerQueue({
      name: NOTIFICATION_REQUEST_QUEUE,
    }),
    TypeOrmModule.forFeature([
      NotificationChannelEntity,
      NotificationChannelProviderEntity,
      NotificationPayloadSchemaEntity,
      NotificationRequestEntity,
      NotificationRecipientEntity,
      NotificationAttachmentEntity,
      NotificationDeliveryEntity,
      NotificationDeliveryAttemptEntity,
      NotificationRequestAuditEntity,
      ClientSystemEntity,
      ClientSystemTokenEntity,
      UserEntity,
      RoleEntity,
      LoginAuditEntity,
    ]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') ?? '24h',
        } as JwtSignOptions,
      }),
    }),
  ],
  controllers: [
    NotificationChannelsController,
    NotificationChannelProvidersController,
    NotificationPayloadSchemasController,
    NotificationRequestsController,
    NotificationCallbacksController,
    ClientSystemController,
    TestN8nController,
    RoleController,
    AuthController,
    UserController,
  ],
  providers: [
    N8nClient,
    TokenGeneratorService,
    ClientSystemAuthGuard,
    NotificationService,
    NotificationChannelsService,
    NotificationChannelProvidersService,
    NotificationPayloadSchemasService,
    NotificationRequestsService,
    NotificationRequestProcessor,
    NotificationRequestAuditService,
    NotificationCallbacksService,
    ClientSystemService,
    ClientSystemTokenService,
    RoleService,
    UserService,
    JwtStrategy,
    PasswordService,
    JwtAuthGuard,
    RolesGuard,
    AuthService,
    RefreshTokenService,
    {
      provide: NotificationChannelRepository,
      useClass: NotificationChannelTypeormRepository,
    },
    {
      provide: NotificationChannelProviderRepository,
      useClass: NotificationChannelProviderTypeormRepository,
    },
    {
      provide: NotificationPayloadSchemaRepository,
      useClass: NotificationPayloadSchemaTypeormRepository,
    },
    {
      provide: NotificationRequestRepository,
      useClass: NotificationRequestTypeormRepository,
    },
    {
      provide: NotificationRecipientRepository,
      useClass: NotificationRecipientTypeormRepository,
    },
    {
      provide: NotificationAttachmentRepository,
      useClass: NotificationAttachmentTypeormRepository,
    },
    {
      provide: NotificationDeliveryRepository,
      useClass: NotificationDeliveryTypeormRepository,
    },
    {
      provide: NotificationDeliveryAttemptRepository,
      useClass: NotificationDeliveryAttemptTypeormRepository,
    },
    {
      provide: NotificationRequestAuditRepository,
      useClass: NotificationRequestAuditTypeormRepository,
    },
    {
      provide: ClientSystemRepository,
      useClass: ClientSystemTypeormRepository,
    },
    {
      provide: ClientSystemTokenRepository,
      useClass: ClientSystemTokenTypeormRepository,
    },
    {
      provide: RoleRepository,
      useClass: RoleTypeormRepository,
    },
    {
      provide: UserRepository,
      useClass: UserTypeormRepository,
    },
    {
      provide: LoginAuditRepository,
      useClass: LoginAuditTypeormRepository,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class MsAlertsModule {}
