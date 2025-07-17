import { MessagingAdapter } from '../adapters/messaging-adapter';

interface PublishUserCreatedUseCaseRequest {
  userId: string;
  name: string;
}

export class PublishUserCreatedUseCase {
  constructor(
    private messagingAdapter: MessagingAdapter<PublishUserCreatedUseCaseRequest>,
  ) {}

  async execute(request: PublishUserCreatedUseCaseRequest): Promise<void> {
    const { userId, name } = request;
    await this.messagingAdapter.sendMessage('users.user-created', {
      userId,
      name,
    });
  }
}
