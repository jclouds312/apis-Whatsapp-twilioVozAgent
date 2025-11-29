'use server';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';
import { getFirestore } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const API_VERSION = 'v20.0';

async function getDb() {
  if (!getApps().length) {
    return getFirestore(initializeApp(firebaseConfig));
  }
  return getFirestore(getApp());
}

async function logApiCall(
  level: 'info' | 'error',
  statusCode: number,
  requestBody: string,
  responseBody: string
) {
  const db = await getDb();
  const logsCollection = collection(db, 'apiLogs');

  await addDoc(logsCollection, {
    timestamp: new Date().toISOString(),
    level,
    endpoint: '/api/whatsapp',
    statusCode,
    requestBody,
    responseBody,
    apiKeyId: 'whatsapp_api', // This could be tied to a user's API key
  });
}

/**
 * Sends a message through the WhatsApp Business API.
 * @param to The recipient's phone number.
 * @param text The content of the message.
 * @returns An object indicating success or failure.
 */
export async function sendWhatsAppMessage(
  to: string,
  text: string
): Promise<{ success: boolean; error?: string }> {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    const errorMessage =
      'Server is not configured for sending WhatsApp messages. Please set environment variables.';
    console.error(errorMessage);
    await logApiCall(
      'error',
      500,
      JSON.stringify({ to, text }),
      JSON.stringify({ error: errorMessage })
    );
    return { success: false, error: errorMessage };
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to: to,
    type: 'text',
    text: {
      preview_url: false,
      body: text,
    },
  };

  const headers = {
    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(url, payload, { headers });
    console.log('WhatsApp message sent successfully:', response.data);
    await logApiCall(
      'info',
      response.status,
      JSON.stringify(payload),
      JSON.stringify(response.data)
    );
    return { success: true };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      'An unknown error occurred.';
    const statusCode = error.response?.status || 500;
    console.error('Failed to send WhatsApp message:', errorMessage);
    await logApiCall(
      'error',
      statusCode,
      JSON.stringify(payload),
      JSON.stringify(error.response?.data || {})
    );

    if (statusCode === 401 || statusCode === 403) {
      return {
        success: false,
        error: `Authentication failed. Check your WhatsApp Access Token. (Details: ${errorMessage})`,
      };
    }
    return { success: false, error: errorMessage };
  }
}
