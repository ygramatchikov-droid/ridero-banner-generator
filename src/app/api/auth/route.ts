import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Simple single-user auth. Change credentials via env vars.
const AUTH_USER = process.env.AUTH_USER || 'ridero';
const AUTH_PASS = process.env.AUTH_PASS || 'banner2026';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (username === AUTH_USER && password === AUTH_PASS) {
      // Create a simple session token
      const token = Buffer.from(`${AUTH_USER}:${Date.now()}`).toString('base64');

      const cookieStore = await cookies();
      cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Неверный логин или пароль' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
  return NextResponse.json({ success: true });
}
