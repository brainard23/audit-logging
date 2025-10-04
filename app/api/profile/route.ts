import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    const response = await fetch(`${API_URL}/api/profile`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader || '',
      },
    });

    const data = await response.json();
    console.log(data, 'here');
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Profile GET proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to profile service' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();
    
    const response = await fetch(`${API_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Profile PUT proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to profile service' },
      { status: 500 }
    );
  }
}
