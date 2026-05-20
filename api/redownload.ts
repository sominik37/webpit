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

const VALID_STATUSES = ['completed', 'billed', 'paid'];

/**
 * Fetch all transactions for a given customer email from Paddle.
 * Paginates through results until a valid paid transaction is found.
 */
async function findPaidTransactionByEmail(
  email: string
): Promise<{ found: boolean; transactionId?: string }> {
  let after: string | undefined;

  // Paginate up to 5 pages (500 transactions) — more than enough for any customer
  for (let page = 0; page < 5; page++) {
    const url = new URL('https://api.paddle.com/transactions');
    url.searchParams.set('customer_email', email);
    url.searchParams.set('per_page', '100');
    if (after) url.searchParams.set('after', after);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      // Paddle returns 404 when no customer exists with that email
      return { found: false };
    }

    const body = await res.json();
    const transactions: any[] = body?.data ?? [];

    for (const txn of transactions) {
      if (VALID_STATUSES.includes(txn.status)) {
        return { found: true, transactionId: txn.id };
      }
    }

    // Check if there are more pages
    const nextCursor = body?.meta?.pagination?.next;
    if (!nextCursor) break;
    after = nextCursor;
  }

  return { found: false };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body ?? {};

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const { found, transactionId } = await findPaidTransactionByEmail(normalizedEmail);

  if (!found || !transactionId) {
    return res.status(404).json({
      error: 'No purchase found for that email address. Please check the email you used at checkout.',
    });
  }

  // Generate a fresh pre-signed URL valid for 15 minutes
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: process.env.R2_FILE_KEY!,
    ResponseContentDisposition: `attachment; filename="${process.env.R2_FILE_KEY}"`,
  });

  const signedUrl = await getSignedUrl(R2, command, { expiresIn: 900 });

  return res.status(200).json({ url: signedUrl, transactionId });
}
