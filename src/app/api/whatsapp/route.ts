import { NextResponse, type NextRequest } from 'next/server';
import { WhatsAppMessageSchema } from '@/lib/schema/whatsapp-message';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const db = getFirestore();

async function logApiCall(
  level: 'info' | 'error',
  statusCode: number,
  requestBody: string,
  responseBody: string
) {
  try {
    await addDoc(collection(db, 'apiLogs'), {
        timestamp: new Date().toISOString(),
        level,
        endpoint: 'WhatsApp Webhook',
        statusCode,
        requestBody,
        responseBody,
        apiKeyId: 'whatsapp_webhook',
    });
  } catch (dbError) {
    console.error("Failed to write log to Firestore:", dbError);
  }
}

/**
 * Handles the webhook verification for the WhatsApp Business API.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified successfully!');
    return new Response(challenge, { status: 200 });
  } else {
    console.error('Failed to verify webhook token.');
    return NextResponse.json({ error: 'Failed to verify webhook token' }, { status: 403 });
  }
}

/**
 * Handles incoming messages and events from the WhatsApp Business API.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const bodyString = JSON.stringify(body, null, 2);
  console.log('Received WhatsApp Webhook:', bodyString);

  try {
    const parseResult = WhatsAppMessageSchema.safeParse(body);

    if (!parseResult.success) {
      console.error('Invalid WhatsApp message format:', parseResult.error.flatten());
      await logApiCall('error', 400, bodyString, JSON.stringify(parseResult.error.flatten()));
      return NextResponse.json({ status: 'error', message: 'Invalid payload' }, { status: 200 });
    }

    const message = parseResult.data.entry[0]?.changes[0]?.value.messages?.[0];
    const contactName = parseResult.data.entry[0]?.changes[0]?.value.contacts?.[0]?.profile.name;

    if (message && contactName) {
      console.log(`Processing message from ${message.from} (${contactName})`);

      // SUPER SIMPLIFIED: For this demo, we assume all messages go to the FIRST user.
      // In a real app, you would have a system to map phone numbers to your app's users.
      const usersCollection = collection(db, 'dashboardUsers');
      const usersSnapshot = await getDocs(query(usersCollection));
      if (usersSnapshot.empty) {
        throw new Error("No dashboard users found to assign the conversation to.");
      }
      const appUserId = usersSnapshot.docs[0].id; // Assign to the first user.

      const conversationsCollection = collection(db, 'users', appUserId, 'conversations');
      const q = query(conversationsCollection, where("contactId", "==", message.from));
      const querySnapshot = await getDocs(q);
      
      let conversationDoc;

      if (querySnapshot.empty) {
        // Create new conversation
        const newConversationData = {
          contactId: message.from,
          contactName: contactName,
          contactEmail: `${message.from}@whatsapp.net`,
          contactAvatar: `https://picsum.photos/seed/${message.from}/100/100`,
          tags: ['New Lead'],
          agentNotes: '',
          orderHistory: [],
          lastMessage: message.text.body,
          lastMessageTime: serverTimestamp(),
          userId: appUserId
        };
        conversationDoc = await addDoc(conversationsCollection, newConversationData);
        console.log("Created new conversation with ID:", conversationDoc.id);
      } else {
        // Update existing conversation
        conversationDoc = querySnapshot.docs[0].ref;
        await updateDoc(conversationDoc, {
          lastMessage: message.text.body,
          lastMessageTime: serverTimestamp()
        });
        console.log("Found existing conversation with ID:", conversationDoc.id);
      }

      // Add the new message to the conversation's subcollection
      const messagesCollection = collection(conversationDoc, 'messages');
      await addDoc(messagesCollection, {
        contactId: message.from,
        content: message.text.body,
        timestamp: serverTimestamp(),
        isSender: false, // This is a received message
      });

      await logApiCall('info', 200, bodyString, JSON.stringify({ status: 'success', messageId: message.id }));
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error: any) {
    console.error('Error processing WhatsApp webhook:', error);
    await logApiCall('error', 500, bodyString, JSON.stringify({ error: error.message }));
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 200 });
  }
}
