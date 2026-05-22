import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { jwtVerify, createRemoteJWKSet, JWTPayload } from 'jose';
import { ENV } from 'src/constants';

export interface SupabaseJWTPayload extends JWTPayload {
  sub: string;
  email?: string;
  role?: string;
  is_anonymous: boolean;
  user_metadata?: {
    email_verified?: boolean;
    phone_verified?: boolean;
  };
}

// reference: https://supabase.com/docs/guides/auth/jwts#verifying-a-jwt-from-supabase
// TODO: understnad the reason for using JWKS and supabase caching layer to not get hacked
// while improving perforamnce as much as possible
const PROJECT_JWKS = createRemoteJWKSet(
  new URL(`${ENV.supabase.projectUrl}/auth/v1/.well-known/jwks.json`),
);

// TODO: add other roles
export const Public = () => SetMetadata('isPublic', true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(Reflector) private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // Try to extract and verify user if token is present (for both public and protected routes)
    if (token) {
      try {
        const { payload } = await this.verifyProjectJWT(token);
        request['user'] = payload;
      } catch (error) {
        console.error(`Failed to verify JWT: ${error}`);
        // Don't throw - just continue without user for public endpoints
        if (!isPublic) {
          throw new UnauthorizedException();
        }
      }
    } else if (!isPublic) {
      // Only require token for non-public endpoints
      console.error('Missing JWT');
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async verifyProjectJWT(jwt: string) {
    return jwtVerify<SupabaseJWTPayload>(jwt, PROJECT_JWKS);
  }
}
