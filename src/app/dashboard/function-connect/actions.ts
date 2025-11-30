'use server';

import { suggestOptimalWorkflows } from '@/ai/flows/suggest-optimal-workflows';
import { retellAgent } from '@/ai/flows/retell-agent';
import { generateSpeech } from '@/ai/flows/text-to-speech';
import { z } from 'zod';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { getApp, getApps, initializeApp } from 'firebase/app';
import axios from 'axios';
import { firebaseConfig } from '@/firebase/config';

const suggestionSchema = z.object({
    crmDataStructures: z.string().min(10, { message: 'CRM data structure must be at least 10 characters long.' }),
    communicationPatterns: z.string().min(10, { message: 'Communication patterns must be at least 10 characters long.' }),
});

export async function getWorkflowSuggestion(prevState: any, formData: FormData) {
  const validatedFields = suggestionSchema.safeParse({
    crmDataStructures: formData.get('crmDataStructures'),
    communicationPatterns: formData.get('communicationPatterns'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      suggestion: null,
    };
  }

  const { crmDataStructures, communicationPatterns } = validatedFields.data;

  try {
    const result = await suggestOptimalWorkflows({
      crmDataStructures,
      communicationPatterns,
    });
    return { suggestion: result.suggestedWorkflows, errors: null };
  } catch (e) {
    console.error(e);
    return { suggestion: null, errors: { _form: ['Failed to generate suggestion.'] } };
  }
}

const retellSchema = z.object({
    textToRetell: z.string().min(5, { message: 'Text must be at least 5 characters long.' }),
});

export async function getRetellSuggestion(prevState: any, formData: FormData) {
  const validatedFields = retellSchema.safeParse({
    textToRetell: formData.get('textToRetell'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      suggestion: null,
    };
  }

  const { textToRetell } = validatedFields.data;

  try {
    const result = await retellAgent({ textToRetell });
    return { suggestion: result.retoldText, errors: null };
  } catch (e) {
    console.error(e);
    return { suggestion: null, errors: { _form: ['Failed to generate suggestion.'] } };
  }
}

const ttsSchema = z.object({
  textToConvert: z.string().min(2, { message: 'Text must be at least 2 characters long.' }),
});

export async function textToSpeech(prevState: any, formData: FormData) {
    const validatedFields = ttsSchema.safeParse({
        textToConvert: formData.get('textToConvert'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            audioData: null,
        };
    }

    const { textToConvert } = validatedFields.data;

    try {
        const result = await generateSpeech(textToConvert);
        return { audioData: result.audio, errors: null };
    } catch (e: any) {
        console.error('Text-to-speech error:', e);
        return { audioData: null, errors: { _form: [e.message || 'Failed to generate audio.'] } };
    }
}

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
