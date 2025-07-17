import { Prisma } from '@prisma/client';
import { UsersRepository } from '../../../../application/repositories/users-repository';
import { prisma } from '@/infra/database/prisma/prisma';

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
}
