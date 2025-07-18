import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InMemoryOutboxEventsRepository } from '../repositories/in-memory/in-memory-outbox-events-repository';
import { OutboxProcessorUseCase } from './outbox-processor';

vi.mock('@/infra/messaging/producer', () => ({
  producer: {
    send: vi.fn(),
  },
}));

import { producer } from '@/infra/messaging/producer';

describe('OutboxProcessorUseCase', () => {
  let outboxEventsRepository: InMemoryOutboxEventsRepository;
  let sut: OutboxProcessorUseCase;

  beforeEach(() => {
    vi.clearAllMocks();

    outboxEventsRepository = new InMemoryOutboxEventsRepository();
    sut = new OutboxProcessorUseCase(outboxEventsRepository);
  });

  it('should process unprocessed outbox events and call producer.send', async () => {
    const event = {
      id: '1',
      event_type: 'user-created',
      payload: { userId: '123' },
      processed: false,
      created_at: new Date(),
      processed_at: null,
    };

    vi.spyOn(outboxEventsRepository, 'findUnprocessed').mockResolvedValue([
      event,
    ]);

    const markProcessedSpy = vi.spyOn(outboxEventsRepository, 'markProcessed');

    vi.mocked(producer.send).mockResolvedValue([]);

    await sut.process();

    expect(producer.send).toHaveBeenCalledWith({
      topic: event.event_type,
      messages: [{ value: JSON.stringify(event.payload) }],
    });
    expect(markProcessedSpy).toHaveBeenCalledWith(event.id);
  });

  it('should not process any events if none are unprocessed', async () => {
    vi.spyOn(outboxEventsRepository, 'findUnprocessed').mockResolvedValue([]);
    const markProcessedSpy = vi.spyOn(outboxEventsRepository, 'markProcessed');

    await sut.process();

    expect(producer.send).not.toHaveBeenCalled();
    expect(markProcessedSpy).not.toHaveBeenCalled();
  });

  it('should continue processing even if producer.send fails for one event', async () => {
    const events = [
      {
        id: '1',
        event_type: 'user-created',
        payload: { userId: '123' },
        processed: false,
        created_at: new Date(),
        processed_at: null,
      },
      {
        id: '2',
        event_type: 'user-updated',
        payload: { userId: '456' },
        processed: false,
        created_at: new Date(),
        processed_at: null,
      },
    ];

    vi.spyOn(outboxEventsRepository, 'findUnprocessed').mockResolvedValue(
      events,
    );

    vi.mocked(producer.send).mockImplementation(({ topic }) => {
      if (topic === 'user-created') {
        return Promise.reject(new Error('Kafka down'));
      }
      return Promise.resolve([]);
    });

    const markProcessedSpy = vi.spyOn(outboxEventsRepository, 'markProcessed');

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await sut.process();

    expect(producer.send).toHaveBeenCalledTimes(events.length);
    expect(markProcessedSpy).toHaveBeenCalledTimes(1);
    expect(markProcessedSpy).toHaveBeenCalledWith('2');
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
