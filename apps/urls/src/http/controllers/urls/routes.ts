import { FastifyInstance } from 'fastify';
import { shortenUrl } from './shorten-url';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { updateUrl } from './update-url';

export async function urlsRoutes(app: FastifyInstance) {
  app.post(
    '/urls',
    { onRequest: [verifyJwt({ allowAnonymous: true })] },
    shortenUrl,
  );
  app.patch('/urls/:id', { onRequest: [verifyJwt()] }, updateUrl);
}
