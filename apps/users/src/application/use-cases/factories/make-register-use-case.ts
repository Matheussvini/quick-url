import { PrismaUsersRepository } from '@/application/repositories/prisma/prisma-users-repository';
import { RegisterUseCase } from '../resgister';
import { KafkaMessagingAdapter } from '@/infra/messaging/kafka/adapters/kafka-messagin-adapter';
import { PublishUserCreatedUseCase } from '../publish-user-created';

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository();

  const messagingAdapter = new KafkaMessagingAdapter();
  const publishUserCreatedUseCase = new PublishUserCreatedUseCase(
    messagingAdapter,
  );

  return new RegisterUseCase(usersRepository, publishUserCreatedUseCase);
}
