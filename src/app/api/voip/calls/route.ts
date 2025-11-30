
import { NextRequest, NextResponse } from 'next/server';

const VOIP_SERVER_URL = process.env.VOIP_SERVER_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, userId } = body;

    const response = await fetch(`${VOIP_SERVER_URL}/api/voip/calls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, userId }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('VoIP call error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate call' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let url = `${VOIP_SERVER_URL}/api/voip/calls?userId=${userId}`;
    if (status) {
      url += `&status=${status}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('VoIP get calls error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calls' },
      { status: 500 }
    );
  }
}
