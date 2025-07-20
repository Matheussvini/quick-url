import { env } from '@/env';
import { PrismaClient } from '../../node_modules/.prisma/client';

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
});
