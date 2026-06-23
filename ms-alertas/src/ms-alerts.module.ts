import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
 // Entities
import {
  NotificationChannelEntity,
  SeverityLevelEntity,
  ClientSystemEntity,
  ClientSystemTokenEntity,
  EventEntity,
  EventTypeEntity,
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
  SeverityLevelService,
  ClientSystemService,
  ClientSystemTokenService,
  EventService,
  EventTypeService,
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
  SeverityLevelRepository,
  ClientSystemRepository,
  ClientSystemTokenRepository,
  EventRepository,
  EventTypeRepository,
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
  ClientSystemController,
  EventController,
  EventTypeController,
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
  ClientSystemTypeormRepository,
  ClientSystemTokenTypeormRepository,
  EventTypeormRepository,
  EventTypeTypeormRepository,
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
      SeverityLevelEntity,
      ClientSystemEntity,
      ClientSystemTokenEntity,
      EventEntity,
      EventTypeEntity,
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
    SeverityLevelController,
    ClientSystemController,
    EventController,
    EventTypeController,
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
    SeverityLevelService,
    ClientSystemService,
    ClientSystemTokenService,
    EventMapper,
    AlertMapper,
    AlertNotificationMapper,
    EventService,
    EventTypeService,
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
      provide: EventTypeRepository,
      useClass: EventTypeTypeormRepository,
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
