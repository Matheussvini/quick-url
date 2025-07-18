import { expect, describe, it, beforeEach, vi } from 'vitest';
import { PublishUserCreatedUseCase } from './publish-user-created';
import { MessagingAdapter } from '../adapters/messaging-adapter';

interface PublishUserCreatedUseCaseRequest {
  userId: string;
  name: string;
}

class PublishUserCreatedUseCaseMock
  implements MessagingAdapter<PublishUserCreatedUseCaseRequest>
{
  private messages: {
    topic: string;
    message: PublishUserCreatedUseCaseRequest;
  }[] = [];

  async sendMessage(
    topic: string,
    message: PublishUserCreatedUseCaseRequest,
  ): Promise<void> {
    this.messages.push({ topic, message });
  }

  getMessages() {
    return this.messages;
  }
}

describe('Publish User Created Use Case', () => {
  let messagingAdapter: PublishUserCreatedUseCaseMock;
  let sut: PublishUserCreatedUseCase;

  beforeEach(() => {
    messagingAdapter = new PublishUserCreatedUseCaseMock();
    sut = new PublishUserCreatedUseCase(messagingAdapter);
  });

  it('should publish user created event', async () => {
    const request: PublishUserCreatedUseCaseRequest = {
      userId: '123',
      name: 'John Doe',
    };

    await sut.execute(request);

    const messages = messagingAdapter.getMessages();
    expect(messages).toHaveLength(1);
    expect(messages[0].topic).toBe('users.user-created');
    expect(messages[0].message).toEqual(request);
  });

  it('should call messagingAdapter with correct parameters', async () => {
    const adapter = {
      sendMessage: vi.fn(),
    };

    const sut = new PublishUserCreatedUseCase(adapter);
    const request = { userId: '123', name: 'John Doe' };

    await sut.execute(request);

    expect(adapter.sendMessage).toHaveBeenCalledWith(
      'users.user-created',
      request,
    );
  });
});
