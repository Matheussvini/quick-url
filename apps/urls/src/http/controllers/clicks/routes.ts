import { FastifyInstance } from 'fastify';
import { clickUrl } from './click-url';

export async function clicksRoutes(app: FastifyInstance) {
  app.get('/:short_code', clickUrl);
}
