
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

// Helper to initialize Firebase
async function getDb() {
  if (!getApps().length) {
    return getFirestore(initializeApp(firebaseConfig));
  }
  return getFirestore(getApp());
}

// This function validates the API key and retrieves associated Twilio credentials
async function getTwilioCredentialsFromApiKey(apiKey: string): Promise<{ accountSid: string; authToken: string } | null> {
  if (!apiKey) return null;

  const db = await getDb();
  const apiKeyDocRef = doc(db, 'apiKeys', apiKey);
  const apiKeyDoc = await getDoc(apiKeyDocRef);

  if (apiKeyDoc.exists()) {
    const data = apiKeyDoc.data();
    // Check if the key is for Twilio and has the necessary credentials
    if (data.service === 'Twilio' && data.twilioAccountSid && data.twilioAuthToken) {
      return {
        accountSid: data.twilioAccountSid,
        authToken: data.twilioAuthToken,
      };
    }
  }
  return null;
}

async function handler(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const apiKey = req.headers.get('Authorization')?.split(' ')?.[1];

  if (!apiKey) {
    return new NextResponse(JSON.stringify({ error: 'Missing API key' }), { status: 401 });
  }

  const credentials = await getTwilioCredentialsFromApiKey(apiKey);

  if (!credentials) {
    return new NextResponse(JSON.stringify({ error: 'Invalid API key or key is not configured for Twilio' }), { status: 401 });
  }

  const { accountSid, authToken } = credentials;
  const slug = params.slug.join('/');
  const twilioApiUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/${slug}.json`;

  const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  try {
    const response = await fetch(twilioApiUrl, {
      method: req.method,
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': req.headers.get('Content-Type') || 'application/x-www-form-urlencoded',
      },
      body: req.method !== 'GET' ? await req.text() : undefined,
    });

    const responseData = await response.json();

    if (!response.ok) {
        return new NextResponse(JSON.stringify({ error: responseData.message || 'Twilio API Error' }), { status: response.status });
    }

    return new NextResponse(JSON.stringify(responseData), { status: response.status });

  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message || 'An unknown error occurred' }), { status: 500 });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
