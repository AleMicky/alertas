import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import {
  NotificationChannelEntity,
  SeverityLevelEntity,
  ClientSystemEntity,
  ClientSystemTokenEntity,
  EventEntity,
  EventTypeEntity,
  AlertRuleEntity,
  AlertEntity,
  AlertNotificationEntity,
  NotificationProviderEntity,
} from './infrastructure/typeorm/entities';
// Services
import { EventMapper } from './app/mappers';
import {
  NotificationChannelsService,
  SeverityLevelService,
  ClientSystemService,
  ClientSystemTokenService,
  EventService,
  EventTypeService,
  AlertRuleService,
  AlertService,
  AlertNotificationService,
  AlertOutcomeService,
  NotificationService,
  NotificationProviderService,
} from './app/services';
// Repositories
import {
  NotificationChannelRepository,
  SeverityLevelRepository,
  ClientSystemRepository,
  ClientSystemTokenRepository,
  EventRepository,
  EventTypeRepository,
  AlertRuleRepository,
  AlertRepository,
  AlertNotificationRepository,
  NotificationProviderRepository,
} from './domain/repositories';
// Controllers
import {
  SeverityLevelController,
  NotificationChannelsController,
  ClientSystemController,
  EventController,
  EventTypeController,
  AlertRuleController,
  AlertController,
  AlertNotificationController,
  TestN8nController,
  NotificationProvidersController,
} from './presentation/controllers';
// Repositories
import {
  SeverityLevelTypeormRepository,
  NotificationChannelTypeormRepository,
  ClientSystemTypeormRepository,
  ClientSystemTokenTypeormRepository,
  EventTypeormRepository,
  EventTypeTypeormRepository,
  AlertRuleTypeormRepository,
  AlertTypeormRepository,
  AlertNotificationTypeormRepository,
  NotificationProviderTypeormRepository,
} from './infrastructure/repositories';
import { N8nClient } from './infrastructure/integrations/n8n/n8n.client';
import { BullModule } from '@nestjs/bullmq';
import { AlertNotificationProcessor } from './app/processors/alert-notification.processor';
import { TokenGeneratorService } from './infrastructure/security/token-generator.service';
import { ClientSystemAuthGuard } from './shared/guards/client-system-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationChannelEntity,
      SeverityLevelEntity,
      ClientSystemEntity,
      ClientSystemTokenEntity,
      EventEntity,
      EventTypeEntity,
      AlertRuleEntity,
      AlertEntity,
      AlertNotificationEntity,
      NotificationProviderEntity,
    ]),
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
    AlertRuleController,
    AlertController,
    AlertNotificationController,
    TestN8nController,
    NotificationProvidersController,
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
    EventService,
    EventTypeService,
    AlertRuleService,
    AlertService,
    AlertOutcomeService,
    AlertNotificationService,
    NotificationProviderService,
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
      provide: AlertRuleRepository,
      useClass: AlertRuleTypeormRepository,
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
      provide: NotificationProviderRepository,
      useClass: NotificationProviderTypeormRepository,
    },
  ],
})
export class MsAlertsModule {}
