import { makeCreateOwnerUseCase } from '@/application/use-cases/factories/make-create-owner-use-case';
import { kafka } from './kafka/kafka';

interface UserCreatedMessage {
  userId: string;
  name: string;
}

const consumer = kafka.consumer({
  groupId: 'urls-group',
  allowAutoTopicCreation: process.env.KAFKA_ENV === 'local',
});

export async function connectConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: 'users.user-created',
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log(`Received message: ${message.value?.toString()}`);
      const data = message.value?.toString();
      if (!data) return;

      const owner: UserCreatedMessage = JSON.parse(data);

      const createOwnerUseCase = makeCreateOwnerUseCase();
      await createOwnerUseCase.execute({
        external_id: owner.userId,
        name: owner.name,
      });

      console.log(`Owner created: ${owner.name}`);
    },
  });
}
