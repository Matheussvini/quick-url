import { MessagingAdapter } from '../../../../application/adapters/messaging-adapter';
import { producer } from '../../producer';

export class KafkaMessagingAdapter<T> implements MessagingAdapter<T> {
  async sendMessage(topic: string, message: T) {
    console.log(`[Users] New message on topic "${topic}"`);
    console.log(JSON.stringify(message, null, 2));

    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}
