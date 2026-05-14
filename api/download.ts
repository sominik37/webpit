import type { VercelRequest, VercelResponse } from '@vercel/node';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

async function verifyPaddleTransaction(transactionId: string): Promise<{ valid: boolean; debug: any }> {
  try {
    const res = await fetch(
      `https://api.paddle.com/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await res.json();
    const status = data?.data?.status;

    return {
      valid: res.ok && (status === 'completed' || status === 'billed'),
      debug: {
        httpStatus: res.status,
        paddleStatus: status,
        hasApiKey: !!process.env.PADDLE_API_KEY,
        apiKeyPrefix: process.env.PADDLE_API_KEY?.substring(0, 8),
        error: data?.error,
      }
    };
  } catch (e: any) {
    return { valid: false, debug: { exception: e.message } };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { transaction_id } = req.query;

  if (!transaction_id || typeof transaction_id !== 'string') {
    return res.status(400).json({ error: 'Missing transaction_id' });
  }

  // Verify the transaction is real and paid
  const { valid, debug } = await verifyPaddleTransaction(transaction_id);

  if (!valid) {
    return res.status(403).json({ error: 'Invalid or unpaid transaction', debug });
  }

  // Generate a pre-signed URL that expires in 10 minutes
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: process.env.R2_FILE_KEY!,
    ResponseContentDisposition: `attachment; filename="${process.env.R2_FILE_KEY}"`,
  });

  const signedUrl = await getSignedUrl(R2, command, { expiresIn: 600 });

  return res.status(200).json({ url: signedUrl });
}
