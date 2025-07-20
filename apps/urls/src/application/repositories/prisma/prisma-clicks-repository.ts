import { prisma } from '@/lib/prisma';
import { ClicksRepository } from '../clicks-repository';
import { Prisma } from '@/generated/.prisma/client';

export class PrismaClicksRepository implements ClicksRepository {
  async postAndIncrementClickCount(urlId: string): Promise<void> {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.url.update({
        where: { id: urlId },
        data: {
          clicks_count: {
            increment: 1,
          },
        },
      });

      await tx.click.create({
        data: {
          shortened_url_id: urlId,
        },
      });
    });
  }
}
