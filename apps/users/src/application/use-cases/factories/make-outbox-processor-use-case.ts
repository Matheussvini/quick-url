import { PrismaOutboxEventsRepository } from '@/application/repositories/prisma/prisma-outbox-events-repository';
import { OutboxProcessorUserCase } from '../outbox-processor';

export function makeOutboxProcessorUseCase() {
  const outboxRepository = new PrismaOutboxEventsRepository();

  return new OutboxProcessorUserCase(outboxRepository);
}
