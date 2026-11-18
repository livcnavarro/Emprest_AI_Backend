import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../auth/authenticated-request';
import { SupabaseAuthService } from './supabase-auth.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly auth: SupabaseAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;
    const match =
      typeof authorization === 'string'
        ? /^Bearer\s+([^\s]+)$/i.exec(authorization)
        : null;

    if (!match) {
      throw new UnauthorizedException('Sessão obrigatória.');
    }

    request.authUserId = await this.auth.getUserId(match[1]);
    return true;
  }
}
