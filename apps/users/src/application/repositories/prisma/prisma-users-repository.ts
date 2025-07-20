import { Prisma } from '@/generated/.prisma/client';
import { prisma } from '../../../lib/prisma';
import { UsersRepository } from '@/application/repositories/users-repository';

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });
    return user;
  }

  async createWithOutboxEvent(data: Prisma.UserCreateInput) {
    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const user = await tx.user.create({ data });

        await tx.outboxEvent.create({
          data: {
            event_type: 'users.user-created',
            payload: {
              userId: user.id,
              name: user.name,
              email: user.email,
            },
          },
        });

        return user;
      },
    );

    return result;
  }
}
