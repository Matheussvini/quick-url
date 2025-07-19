import { MessagingAdapter } from '../../../../application/adapters/messaging-adapter';
import { producer } from '../../producer';

export class KafkaMessagingAdapter<T> implements MessagingAdapter<T> {
  async sendMessage(topic: string, message: T) {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}
