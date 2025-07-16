import { FastifyInstance } from 'fastify';
import { register } from './register';

export async function usersRoutes(app: FastifyInstance) {
  console.log('usersRoutes registered');
  app.post('/users', register);
}
