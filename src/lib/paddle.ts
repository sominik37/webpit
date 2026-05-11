import { initializePaddle, type Paddle } from '@paddle/paddle-js';

let paddleInstance: Paddle | undefined;

export async function getPaddle(): Promise<Paddle | undefined> {
  if (paddleInstance) return paddleInstance;

  paddleInstance = await initializePaddle({
    environment: 'production',
    token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
  });

  return paddleInstance;
}
