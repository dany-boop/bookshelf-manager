import { NextRequest, NextResponse } from 'next/server';

const requests = new Map();

export async function rateLimit(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'anonymous';
  const now = Date.now();

  if (!requests.has(ip)) {
    requests.set(ip, { count: 1, lastRequest: now });
  } else {
    const { count, lastRequest } = requests.get(ip);
    if (now - lastRequest < 60000) {
      if (count >= 5) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        );
      }
      requests.set(ip, { count: count + 1, lastRequest: now });
    } else {
      requests.set(ip, { count: 1, lastRequest: now });
    }
  }
}
