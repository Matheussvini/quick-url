import { Kafka, KafkaConfig } from 'kafkajs';

import { env } from '@/env';

if (!process.env.KAFKA_BROKER) {
  throw new Error('Kafka broker address not set!');
}
if (env.KAFKA_ENV === 'cloud' && (!env.KAFKA_USER || !env.KAFKA_PASS)) {
  throw new Error('Kafka user and password must be set for cloud environment!');
}

const kafkaConfig: KafkaConfig = {
  clientId: 'users',
  brokers: [env.KAFKA_BROKER],
};

if (env.KAFKA_ENV === 'cloud') {
  kafkaConfig.sasl = {
    mechanism: 'scram-sha-256',
    username: env.KAFKA_USER!,
    password: env.KAFKA_PASS!,
  };
  kafkaConfig.ssl = true;
}

export const kafka = new Kafka(kafkaConfig);
