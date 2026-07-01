import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
// Entities
import {
  NotificationChannelEntity,
  NotificationChannelProviderEntity,
  NotificationPayloadSchemaEntity,
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationChannelEntity,
      NotificationChannelProviderEntity,
      NotificationPayloadSchemaEntity,
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
