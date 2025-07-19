import { FastifyInstance } from 'fastify';
import { shortenUrl } from './shorten-url';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { updateUrl } from './update-url';
import { deleteUrl } from './delete-url';
import { search } from './search';

export async function urlsRoutes(app: FastifyInstance) {
  app.get('/urls', { onRequest: [verifyJwt()] }, search);
  app.post(
    '/urls',
    { onRequest: [verifyJwt({ allowAnonymous: true })] },
    shortenUrl,
  );
  app.patch('/urls/:id', { onRequest: [verifyJwt()] }, updateUrl);
  app.delete('/urls/:id', { onRequest: [verifyJwt()] }, deleteUrl);
}
