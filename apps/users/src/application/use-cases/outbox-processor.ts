import { producer } from '@/infra/messaging/producer';
import { OutboxEventsRepository } from '../repositories/outbox-events-repository';

export class OutboxProcessorUseCase {
  constructor(private outboxRepository: OutboxEventsRepository) {}

  async process() {
    const events = await this.outboxRepository.findUnprocessed(10);

    for (const event of events) {
      try {
        await producer.send({
          topic: event.event_type,
          messages: [{ value: JSON.stringify(event.payload) }],
        });

        await this.outboxRepository.markProcessed(event.id);

        console.log(`Event ${event.id} processed`);
      } catch (error) {
        console.error(`Failed to process event ${event.id}`, error);
      }
    }
  }

  async start(intervalMs = 5000) {
    console.log('📡 Starting outbox worker...');
    while (true) {
      try {
        await this.process();
      } catch (err) {
        console.error('❌ Unexpected error in outbox worker', err);
      }
      await new Promise((res) => setTimeout(res, intervalMs));
    }
  }
}
