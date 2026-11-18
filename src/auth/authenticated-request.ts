import { IncomingHttpHeaders } from 'node:http';

export interface AuthenticatedRequest {
  headers: Pick<IncomingHttpHeaders, 'authorization'>;
  authUserId: string;
}
