import { PrismaUsersRepository } from '@/application/repositories/prisma/prisma-users-repository';
import { RegisterUseCase } from '../resgister';

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository();

  return new RegisterUseCase(usersRepository);
}
