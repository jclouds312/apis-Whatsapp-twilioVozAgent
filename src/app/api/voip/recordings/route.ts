
import { NextRequest, NextResponse } from 'next/server';

const VOIP_SERVER_URL = process.env.VOIP_SERVER_URL || 'http://localhost:8080';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    const response = await fetch(`${VOIP_SERVER_URL}/api/voip/recordings?userId=${userId}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('VoIP recordings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recordings' },
      { status: 500 }
    );
  }
}
