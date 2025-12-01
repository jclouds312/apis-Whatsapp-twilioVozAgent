
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import httpProxy from 'http-proxy';
import { NextApiRequest } from 'next';

// This is required to prevent Next.js from parsing the request body
export const config = {
    api: {
        bodyParser: false,
    },
};

// Helper to initialize Firebase
async function getDb() {
    if (!getApps().length) {
        return getFirestore(initializeApp(firebaseConfig));
    }
    return getFirestore(getApp());
}

// This function validates the API key
async function validateApiKey(apiKey: string): Promise<boolean> {
    if (!apiKey) return false;

    const db = await getDb();
    const apiKeyDocRef = doc(db, 'apiKeys', apiKey);
    const apiKeyDoc = await getDoc(apiKeyDocRef);

    if (apiKeyDoc.exists()) {
        const data = apiKeyDoc.data();
        // Check if the key is for the Call API service
        return data.service === 'Call API';
    }
    return false;
}

const proxy = httpProxy.createProxyServer({
    target: 'ws://localhost:5059',
    ws: true,
});

const handler = async (req: NextApiRequest, res: any) => {
    const apiKey = req.headers['authorization']?.split(' ')?.[1];

    if (!apiKey) {
        res.status(401).json({ error: 'Missing API key' });
        return;
    }

    const isValid = await validateApiKey(apiKey);

    if (!isValid) {
        res.status(401).json({ error: 'Invalid API key' });
        return;
    }

    // Let the proxy handle the upgrade
    proxy.web(req, res, {},
        (err) => {
            console.error('WebSocket proxy error:', err);
            // This part is crucial for preventing crashes
            if (!res.headersSent) {
                 res.status(500).send('Proxy error');
            }
        }
    );

};

export { handler as GET, handler as POST };
