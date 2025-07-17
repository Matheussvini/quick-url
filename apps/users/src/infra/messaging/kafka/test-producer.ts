import { kafka } from './kafka';
import { env } from '../../../env'; // ajuste o caminho conforme seu projeto

async function testProducer() {
  const producer = kafka.producer({
    allowAutoTopicCreation: env.KAFKA_ENV === 'local',
  });
  await producer.connect();

  await producer.send({
    topic: 'users.user-created',
    messages: [
      {
        value: JSON.stringify({
          id: '123',
          name: 'Tester',
          email: 'tester@example.com',
        }),
      },
    ],
  });

  await producer.disconnect();
  console.log('Mensagem enviada com sucesso!');
}

testProducer().catch(console.error);
