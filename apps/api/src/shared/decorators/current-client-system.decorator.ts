import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ClientSystem } from 'src/domain/entities/client-system';

export const CurrentClientSystem = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ClientSystem => {
    const request = ctx.switchToHttp().getRequest();
    return request.clientSystem;
  },
);
