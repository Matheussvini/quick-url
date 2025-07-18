import { kafka } from './kafka/kafka';

export const producer = kafka.producer({
  allowAutoTopicCreation: process.env.KAFKA_ENV === 'local',
});

producer.connect().then(() => {
  console.log('[Users] Kafka producer connected');
});
