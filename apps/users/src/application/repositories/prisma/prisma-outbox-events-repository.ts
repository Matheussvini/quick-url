import { OutboxEventsRepository } from '@/application/repositories/outbox-events-repository';
import { prisma } from '@/lib/prisma';

export class PrismaOutboxEventsRepository implements OutboxEventsRepository {
  async findUnprocessed(limit: number) {
    return prisma.outboxEvent.findMany({
      where: { processed: false },
      take: limit,
    });
  }

  async markProcessed(id: string) {
    await prisma.outboxEvent.update({
      where: { id },
      data: { processed: true, processed_at: new Date() },
    });
  }
}
