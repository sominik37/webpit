import { initializePaddle, type Paddle } from '@paddle/paddle-js';

let paddleInstance: Paddle | undefined;
// Mutable callback ref — updated without reinitializing Paddle
let completionCallback: ((transactionId: string) => void) | undefined;

export async function getPaddle(
  onCheckoutComplete?: (transactionId: string) => void
): Promise<Paddle | undefined> {
  // Update the callback ref
  if (onCheckoutComplete) {
    completionCallback = onCheckoutComplete;
  }

  // Only initialize once
  if (paddleInstance) return paddleInstance;

  paddleInstance = await initializePaddle({
    environment: 'production',
    token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
    eventCallback: (event: any) => {
      if (event.name === 'checkout.completed') {
        const txnId = event.data?.transaction_id;
        if (txnId && completionCallback) {
          completionCallback(txnId);
        }
      }
    },
  });

  return paddleInstance;
}
