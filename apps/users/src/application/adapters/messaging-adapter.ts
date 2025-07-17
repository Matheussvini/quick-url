export interface MessagingAdapter<T> {
  sendMessage(topic: string, message: T): Promise<void>;
}
