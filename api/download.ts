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

async function verifyPaddleTransaction(transactionId: string): Promise<boolean> {
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

    if (!res.ok) return false;

    const data = await res.json();
    const status = data?.data?.status;

    // Only allow completed/paid transactions
    return status === 'completed' || status === 'billed';
  } catch {
    return false;
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
  const isValid = await verifyPaddleTransaction(transaction_id);

  if (!isValid) {
    return res.status(403).json({ error: 'Invalid or unpaid transaction' });
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
