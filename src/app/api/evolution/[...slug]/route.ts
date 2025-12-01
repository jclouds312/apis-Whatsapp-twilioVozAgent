
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import { ApiKey } from '@/lib/types';
import { doc, getDoc } from 'firebase/firestore';

const EVOLUTION_API_URL = 'http://localhost:3333';

async function getDb() {
  if (!getApps().length) {
    return getFirestore(initializeApp(firebaseConfig));
  }
  return getFirestore(getApp());
}

async function validateApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey) {
    return false;
  }
  const db = await getDb();
  // This is a simplified check. In a real application, you'd query your database
  // to see if the API key is valid and active.
  const apiKeyDocRef = doc(db, 'apiKeys', apiKey);
  const apiKeyDoc = await getDoc(apiKeyDocRef);
  return apiKeyDoc.exists();
}

async function logApiCall(
    level: 'info' | 'error',
    statusCode: number,
    requestBody: string,
    responseBody: string,
    apiKeyId: string
  ) {
    const db = await getDb();
    const logsCollection = collection(db, 'apiLogs');
  
    await addDoc(logsCollection, {
      timestamp: new Date().toISOString(),
      level,
      endpoint: '/api/evolution',
      statusCode,
      requestBody,
      responseBody,
      apiKeyId,
    });
  }

async function handler(req: NextRequest, { params }: { params: { slug: string[] } }) {
    const apiKey = req.headers.get('Authorization')?.split(' ')?.[1];

    if (!apiKey || !await validateApiKey(apiKey)) {
        return new NextResponse(JSON.stringify({ error: 'Invalid or missing API key' }), { status: 401 });
    }

    const slug = params.slug.join('/');
    const url = `${EVOLUTION_API_URL}/${slug}`;

    try {
        const response = await axios({
            method: req.method,
            url: url,
            data: await req.text(),
            headers: {
                'Content-Type': req.headers.get('Content-Type'),
            }
        });

        await logApiCall('info', response.status, await req.text(), JSON.stringify(response.data), apiKey);

        return new NextResponse(JSON.stringify(response.data), { status: response.status });

    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'An unknown error occurred.';
        const statusCode = error.response?.status || 500;

        await logApiCall('error', statusCode, await req.text(), JSON.stringify(error.response?.data || {}), apiKey);

        return new NextResponse(JSON.stringify({ error: errorMessage }), { status: statusCode });
    }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
