import { initializePaddle, type Paddle } from '@paddle/paddle-js';

let paddleInstance: Paddle | undefined;

export async function getPaddle(
  onCheckoutComplete?: (transactionId: string) => void
): Promise<Paddle | undefined> {
  // If a callback is provided, reinitialize with it
  if (onCheckoutComplete || !paddleInstance) {
    paddleInstance = await initializePaddle({
      environment: 'production',
      token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
      eventCallback: (event: any) => {
        if (event.name === 'checkout.completed') {
          const txnId = event.data?.transaction_id;
          if (txnId && onCheckoutComplete) {
            onCheckoutComplete(txnId);
          }
        }
      },
    });
  }

  return paddleInstance;
}
