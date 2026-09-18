import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret =
    req.headers.get('x-sanity-webhook-secret') || req.nextUrl.searchParams.get('secret');

  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // Sanity may send an empty body on some triggers
  }

  const slug =
    typeof body?.slug === 'string' ? body.slug : body?.slug?.current ?? undefined;

  revalidateTag('post');
  revalidatePath('/blog');

  if (slug) {
    revalidateTag(`post:${slug}`);
    revalidatePath(`/blog/${slug}`);
  }

  return NextResponse.json({
    revalidated: true,
    slug: slug ?? null,
    now: Date.now(),
  });
}
