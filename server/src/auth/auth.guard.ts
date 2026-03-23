import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { jwtVerify, createRemoteJWKSet } from 'jose';
import { ENV } from 'src/constants';

// reference: https://supabase.com/docs/guides/auth/jwts#verifying-a-jwt-from-supabase
// TODO: understnad the reason for using JWKS and supabase caching layer to not get hacked
// while improving perforamnce as much as possible
const PROJECT_JWKS = createRemoteJWKSet(
  new URL(
    `https://${ENV.supabase.project_id}.supabase.co/auth/v1/.well-known/jwks.json`,
  ),
);

// TODO: add other roles
export const Public = () => SetMetadata('isPublic', true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.verifyProjectJWT(token);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    console.log(request.headers);
    return type === 'Bearer' ? token : undefined;
  }

  private async verifyProjectJWT(jwt: string) {
    return jwtVerify(jwt, PROJECT_JWKS);
  }
}
