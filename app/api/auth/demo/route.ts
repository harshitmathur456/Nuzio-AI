import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let name = 'Aarav Sharma';
  let email = 'aarav.sharma@nuzio.ai';

  try {
    const body = await request.json();
    if (body.name) name = body.name;
    if (body.email) email = body.email;
  } catch {
    // default demo user
  }

  const demoUser = {
    id: 'demo-user-' + Math.random().toString(36).substring(2, 9),
    name,
    email,
    created_at: new Date().toISOString(),
  };

  const response = NextResponse.json({
    success: true,
    user: demoUser,
    message: 'Demo session created successfully',
  });

  response.cookies.set('nuzio_demo_user', JSON.stringify(demoUser), {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    httpOnly: false, // Accessible to client for displaying user name
  });

  return response;
}
