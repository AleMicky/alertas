import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { ClsService } from 'nestjs-cls';
  import { Observable } from 'rxjs';
  
  import {
    CLS_USER_ID,
    CLS_USERNAME,
    CLS_CLIENT_SYSTEM_CODE,
  } from '../cls/cls.keys';
  
  @Injectable()
  export class ClsUserInterceptor implements NestInterceptor {
    constructor(private readonly cls: ClsService) {}
  
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<any> {
      const request = context.switchToHttp().getRequest();
  
      const user = request.user;
      const clientSystem = request.clientSystem;
  
      this.cls.set(CLS_USER_ID, user?.id ?? null);
      this.cls.set(CLS_USERNAME, user?.username ?? null);
      this.cls.set(
        CLS_CLIENT_SYSTEM_CODE,
        clientSystem?.code ?? null,
      );
  
      return next.handle();
    }
  }