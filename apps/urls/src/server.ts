import { app } from './app';
import { env } from './env';
import { connectConsumer } from './infra/messaging/consumer';
app
  .listen({
    host: '0.0.0.0', // importante para que funcione com outros frontend
    port: env.PORT,
  })
  .then(async () => {
    console.log('🚀 HTTP Server URLS running!');
    try {
      await connectConsumer();
      console.log('[Urls] Listening to Kafka messages');
    } catch (err) {
      console.error('[Urls] Error connecting to Kafka consumer:', err);
      process.exit(1);
    }
  });
