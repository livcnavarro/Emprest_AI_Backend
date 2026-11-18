import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';
import { SupabaseConfigService } from './supabase-config.service';

const authenticatedUserSchema = z.object({
  id: z.string().uuid(),
});

@Injectable()
export class SupabaseAuthService {
  constructor(private readonly config: SupabaseConfigService) {}

  async getUserId(accessToken: string): Promise<string> {
    let response: Response;
    try {
      response = await fetch(this.config.getUserUrl(), {
        headers: {
          apikey: this.config.anonKey,
          authorization: `Bearer ${accessToken}`,
        },
        signal: AbortSignal.timeout(8000),
      });
    } catch (error) {
      throw new ServiceUnavailableException(
        'Não foi possível validar a sessão no Supabase Auth.',
        { cause: error },
      );
    }

    if (response.status === 401 || response.status === 403) {
      throw new UnauthorizedException('Sessão inválida ou expirada.');
    }
    if (!response.ok) {
      throw new ServiceUnavailableException(
        'O Supabase Auth não está disponível.',
      );
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch (error) {
      throw new BadGatewayException(
        'O Supabase Auth retornou uma resposta inválida.',
        { cause: error },
      );
    }

    const user = authenticatedUserSchema.safeParse(body);
    if (!user.success) {
      throw new BadGatewayException(
        'O Supabase Auth retornou uma identidade inválida.',
      );
    }

    return user.data.id;
  }
}
