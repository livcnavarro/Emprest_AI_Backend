import { Injectable } from '@nestjs/common';
import { z } from 'zod';

const configSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
});

function isPublicKey(key: string): boolean {
  if (key.startsWith('sb_secret_')) {
    return false;
  }
  if (key.startsWith('sb_publishable_')) {
    return true;
  }

  const payload = key.split('.')[1];
  if (!payload) {
    return false;
  }

  try {
    const claims: unknown = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    );
    return (
      typeof claims === 'object' &&
      claims !== null &&
      'role' in claims &&
      claims.role === 'anon'
    );
  } catch {
    return false;
  }
}

@Injectable()
export class SupabaseConfigService {
  readonly url: string;
  readonly anonKey: string;

  constructor() {
    const result = configSchema.safeParse({
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    });

    if (!result.success) {
      throw new Error(
        'Configure SUPABASE_URL e SUPABASE_ANON_KEY no Backend.',
      );
    }

    const parsedUrl = new URL(result.data.SUPABASE_URL);
    const localDevelopment =
      parsedUrl.protocol === 'http:' && parsedUrl.hostname === 'localhost';
    if (parsedUrl.protocol !== 'https:' && !localDevelopment) {
      throw new Error('SUPABASE_URL deve usar HTTPS.');
    }
    if (!isPublicKey(result.data.SUPABASE_ANON_KEY)) {
      throw new Error('SUPABASE_ANON_KEY deve ser uma chave pública anon.');
    }

    this.url = parsedUrl.origin;
    this.anonKey = result.data.SUPABASE_ANON_KEY;
  }

  getUserUrl(): string {
    return new URL('/auth/v1/user', this.url).toString();
  }

  getPublicStorageUrl(imagePath: string): string {
    const segments = imagePath.split('/');
    if (
      segments.length !== 2 ||
      segments[0] !== 'equipamentos' ||
      !/^[A-Za-z0-9._-]+\.jpg$/i.test(segments[1])
    ) {
      throw new Error('Caminho de imagem do equipamento inválido.');
    }

    const encodedPath = segments.map(encodeURIComponent).join('/');
    return new URL(
      `/storage/v1/object/public/bucket-equipamentos-pratica/${encodedPath}`,
      this.url,
    ).toString();
  }
}
