import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
 // Entities
import {
  NotificationChannelEntity,
  NotificationChannelProviderEntity,
  SeverityLevelEntity,
  ClientSystemEntity,
  ClientSystemTokenEntity,
  EventEntity,
  AlertEntity,
  AlertNotificationEntity,
  RoleEntity,
  UserEntity,
  LoginAuditEntity,
} from './infrastructure/typeorm/entities';
// Services
import { EventMapper, AlertMapper, AlertNotificationMapper } from './app/mappers';
import {
  NotificationChannelsService,
  NotificationChannelProvidersService,
  SeverityLevelService,
  ClientSystemService,
  ClientSystemTokenService,
  EventService,
  AlertService,
  AlertNotificationService,
  AlertOutcomeService,
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
  SeverityLevelRepository,
  ClientSystemRepository,
  ClientSystemTokenRepository,
  EventRepository,
  AlertRepository,
  AlertNotificationRepository,
  RoleRepository,
  UserRepository,
  LoginAuditRepository,
} from './domain/repositories';
// Controllers
import {
  SeverityLevelController,
  NotificationChannelsController,
  NotificationChannelProvidersController,
  ClientSystemController,
  EventController,
  AlertController,
  AlertNotificationController,
  TestN8nController,
  RoleController,
  AuthController,
  UserController,
} from './presentation/controllers';
// Repositories
import {
  SeverityLevelTypeormRepository,
  NotificationChannelTypeormRepository,
  NotificationChannelProviderTypeormRepository,
  ClientSystemTypeormRepository,
  ClientSystemTokenTypeormRepository,
  EventTypeormRepository,
  AlertTypeormRepository,
  AlertNotificationTypeormRepository,
  RoleTypeormRepository,
  UserTypeormRepository,
  LoginAuditTypeormRepository,
} from './infrastructure/repositories';
import { N8nClient } from './infrastructure/integrations/n8n/n8n.client';
import { BullModule } from '@nestjs/bullmq';
import { AlertNotificationProcessor } from './app/processors/alert-notification.processor';
import { TokenGeneratorService } from './infrastructure/security/token-generator.service';
import { ClientSystemAuthGuard } from './shared/guards/client-system-auth.guard';
import { PassportModule } from '@nestjs/passport';
import {
  JwtAuthGuard,
  JwtStrategy,
  PasswordService,
  RolesGuard,
} from './infrastructure/security';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationChannelEntity,
      NotificationChannelProviderEntity,
      SeverityLevelEntity,
      ClientSystemEntity,
      ClientSystemTokenEntity,
      EventEntity,
      AlertEntity,
      AlertNotificationEntity,
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
    BullModule.registerQueue({
      name: 'alert-notifications',
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    }),
  ],
  controllers: [
    NotificationChannelsController,
    NotificationChannelProvidersController,
    SeverityLevelController,
    ClientSystemController,
    EventController,
    AlertController,
    AlertNotificationController,
    TestN8nController,
    RoleController,
    AuthController,
    UserController,
  ],
  providers: [
    N8nClient,
    AlertNotificationProcessor,
    TokenGeneratorService,
    ClientSystemAuthGuard,
    NotificationService,
    NotificationChannelsService,
    NotificationChannelProvidersService,
    SeverityLevelService,
    ClientSystemService,
    ClientSystemTokenService,
    EventMapper,
    AlertMapper,
    AlertNotificationMapper,
    EventService,
    AlertService,
    AlertOutcomeService,
    AlertNotificationService,
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
      provide: SeverityLevelRepository,
      useClass: SeverityLevelTypeormRepository,
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
      provide: EventRepository,
      useClass: EventTypeormRepository,
    },
    {
      provide: AlertRepository,
      useClass: AlertTypeormRepository,
    },
    {
      provide: AlertNotificationRepository,
      useClass: AlertNotificationTypeormRepository,
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
