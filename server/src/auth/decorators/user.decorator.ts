import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SupabaseJWTPayload } from '../auth.guard';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): SupabaseJWTPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
