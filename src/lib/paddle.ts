import { initializePaddle, type Paddle } from '@paddle/paddle-js';

let paddleInstance: Paddle | undefined;

export async function getPaddle(): Promise<Paddle | undefined> {
  if (paddleInstance) return paddleInstance;

  const isDev = import.meta.env.DEV;

  paddleInstance = await initializePaddle({
    environment: isDev ? 'sandbox' : 'production',
    token: isDev
      ? import.meta.env.VITE_PADDLE_SANDBOX_TOKEN
      : import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
  });

  return paddleInstance;
}
