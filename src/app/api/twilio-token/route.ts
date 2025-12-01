
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import twilio from 'twilio';

// Initialize Firebase
function getDb() {
    if (!getApps().length) {
        return getFirestore(initializeApp(firebaseConfig));
    }
    return getFirestore(getApp());
}

// Function to find the Twilio API key and credentials
async function getTwilioCredentials(apiKey: string) {
    const db = getDb();
    const apiKeysRef = collection(db, 'apiKeys');
    
    // First, try to get the doc by ID if the apiKey is the document ID
    const docRef = doc(apiKeysRef, apiKey);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().service === 'Twilio') {
        return docSnap.data();
    }

    // If not found by ID, query by the key field
    const q = query(apiKeysRef, where("key", "==", apiKey), where("service", "==", "Twilio"));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        // Return the first matching key
        return querySnapshot.docs[0].data();
    }

    return null;
}


export async function GET(req: NextRequest) {
    const apiKey = req.headers.get('authorization')?.split(' ')?.[1];

    if (!apiKey) {
        return NextResponse.json({ error: 'Missing API key' }, { status: 401 });
    }

    try {
        const twilioCreds = await getTwilioCredentials(apiKey);

        if (!twilioCreds || !twilioCreds.twilioAccountSid || !twilioCreds.twilioAuthToken) {
            return NextResponse.json({ error: 'Invalid or incomplete Twilio API key' }, { status: 401 });
        }
        
        const AccessToken = twilio.jwt.AccessToken;
        const VoiceGrant = AccessToken.VoiceGrant;
        
        const voiceGrant = new VoiceGrant({
            outgoingApplicationSid: process.env.TWIML_APP_SID, // You need to create a TwiML app and set this env var
            incomingAllow: true // Allow incoming calls
        });

        const token = new AccessToken(
            twilioCreds.twilioAccountSid,
            process.env.TWILIO_API_KEY_SID!, // Use API Key SID and Secret for best practice
            process.env.TWILIO_API_KEY_SECRET!,
            { 
                identity: `user_${Date.now()}`, // A unique identity for the user
                ttl: 3600 // Token TTL in seconds (e.g., 1 hour)
            }
        );

        token.addGrant(voiceGrant);
        
        return NextResponse.json({ token: token.toJwt() });

    } catch (error) {
        console.error("Error generating Twilio token:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
