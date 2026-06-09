import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { KeycloakUser } from './keycloak-user.type';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): KeycloakUser | undefined => {
    const request = context.switchToHttp().getRequest<{ user?: KeycloakUser }>();
    return request.user;
  },
);
