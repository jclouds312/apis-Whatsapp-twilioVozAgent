'use server';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';
import { getFirestore } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const META_APP_ID = process.env.META_APP_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;
const API_VERSION = 'v21.0';

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

/**
 * Sends a template message through the WhatsApp Business API.
 * @param to The recipient's phone number.
 * @param templateName The name of the template to send.
 * @param languageCode The language code for the template (e.g., 'en_US', 'es').
 * @param components Optional template components (header, body, buttons).
 * @returns An object indicating success or failure.
 */
export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  languageCode: string = 'en_US',
  components?: Array<{
    type: 'header' | 'body' | 'button';
    parameters?: Array<{ type: string; text?: string; image?: { link: string } }>;
    sub_type?: string;
    index?: number;
  }>
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    const errorMessage =
      'Server is not configured for sending WhatsApp messages. Please set environment variables.';
    console.error(errorMessage);
    return { success: false, error: errorMessage };
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const payload: any = {
    messaging_product: 'whatsapp',
    to: to,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
    },
  };

  if (components && components.length > 0) {
    payload.template.components = components;
  }

  const headers = {
    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(url, payload, { headers });
    console.log('WhatsApp template sent successfully:', response.data);
    await logApiCall(
      'info',
      response.status,
      JSON.stringify(payload),
      JSON.stringify(response.data)
    );
    return { success: true, messageId: response.data.messages?.[0]?.id };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      'An unknown error occurred.';
    console.error('Failed to send WhatsApp template:', errorMessage);
    await logApiCall(
      'error',
      error.response?.status || 500,
      JSON.stringify(payload),
      JSON.stringify(error.response?.data || {})
    );
    return { success: false, error: errorMessage };
  }
}

/**
 * Sends an image message through the WhatsApp Business API.
 * @param to The recipient's phone number.
 * @param imageUrl The URL of the image to send.
 * @param caption Optional caption for the image.
 * @returns An object indicating success or failure.
 */
export async function sendWhatsAppImage(
  to: string,
  imageUrl: string,
  caption?: string
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    const errorMessage =
      'Server is not configured for sending WhatsApp messages. Please set environment variables.';
    console.error(errorMessage);
    return { success: false, error: errorMessage };
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const payload: any = {
    messaging_product: 'whatsapp',
    to: to,
    type: 'image',
    image: {
      link: imageUrl,
    },
  };

  if (caption) {
    payload.image.caption = caption;
  }

  const headers = {
    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(url, payload, { headers });
    console.log('WhatsApp image sent successfully:', response.data);
    await logApiCall(
      'info',
      response.status,
      JSON.stringify(payload),
      JSON.stringify(response.data)
    );
    return { success: true, messageId: response.data.messages?.[0]?.id };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      'An unknown error occurred.';
    console.error('Failed to send WhatsApp image:', errorMessage);
    await logApiCall(
      'error',
      error.response?.status || 500,
      JSON.stringify(payload),
      JSON.stringify(error.response?.data || {})
    );
    return { success: false, error: errorMessage };
  }
}

/**
 * Marks a message as read in WhatsApp.
 * @param messageId The ID of the message to mark as read.
 * @returns An object indicating success or failure.
 */
export async function markMessageAsRead(
  messageId: string
): Promise<{ success: boolean; error?: string }> {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    return { success: false, error: 'Server is not configured for WhatsApp API.' };
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    status: 'read',
    message_id: messageId,
  };

  const headers = {
    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(url, payload, { headers });
    console.log('Message marked as read:', response.data);
    return { success: true };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      'An unknown error occurred.';
    console.error('Failed to mark message as read:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Gets the WhatsApp Business Profile information.
 * @returns The business profile data or an error.
 */
export async function getBusinessProfile(): Promise<{
  success: boolean;
  error?: string;
  profile?: {
    about?: string;
    address?: string;
    description?: string;
    email?: string;
    vertical?: string;
    websites?: string[];
    profile_picture_url?: string;
  };
}> {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    return { success: false, error: 'Server is not configured for WhatsApp API.' };
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/whatsapp_business_profile?fields=about,address,description,email,profile_picture_url,websites,vertical`;

  const headers = {
    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
  };

  try {
    const response = await axios.get(url, { headers });
    console.log('Business profile fetched:', response.data);
    return { success: true, profile: response.data.data?.[0] };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      'An unknown error occurred.';
    console.error('Failed to get business profile:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Sends an interactive button message through the WhatsApp Business API.
 * @param to The recipient's phone number.
 * @param bodyText The body text of the message.
 * @param buttons Array of button objects.
 * @param headerText Optional header text.
 * @param footerText Optional footer text.
 * @returns An object indicating success or failure.
 */
export async function sendWhatsAppInteractiveButtons(
  to: string,
  bodyText: string,
  buttons: Array<{ id: string; title: string }>,
  headerText?: string,
  footerText?: string
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    return { success: false, error: 'Server is not configured for WhatsApp API.' };
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const payload: any = {
    messaging_product: 'whatsapp',
    to: to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: bodyText,
      },
      action: {
        buttons: buttons.slice(0, 3).map((btn) => ({
          type: 'reply',
          reply: {
            id: btn.id,
            title: btn.title.slice(0, 20),
          },
        })),
      },
    },
  };

  if (headerText) {
    payload.interactive.header = {
      type: 'text',
      text: headerText,
    };
  }

  if (footerText) {
    payload.interactive.footer = {
      text: footerText,
    };
  }

  const headers = {
    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(url, payload, { headers });
    console.log('WhatsApp interactive message sent:', response.data);
    await logApiCall(
      'info',
      response.status,
      JSON.stringify(payload),
      JSON.stringify(response.data)
    );
    return { success: true, messageId: response.data.messages?.[0]?.id };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      'An unknown error occurred.';
    console.error('Failed to send interactive message:', errorMessage);
    await logApiCall(
      'error',
      error.response?.status || 500,
      JSON.stringify(payload),
      JSON.stringify(error.response?.data || {})
    );
    return { success: false, error: errorMessage };
  }
}

/**
 * Gets the WhatsApp API configuration status.
 * @returns An object indicating which credentials are configured.
 */
export async function getWhatsAppConfigStatus(): Promise<{
  isConfigured: boolean;
  hasAccessToken: boolean;
  hasPhoneNumberId: boolean;
  hasMetaAppId: boolean;
  hasMetaAppSecret: boolean;
  apiVersion: string;
}> {
  return {
    isConfigured: !!(WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_NUMBER_ID),
    hasAccessToken: !!WHATSAPP_ACCESS_TOKEN,
    hasPhoneNumberId: !!WHATSAPP_PHONE_NUMBER_ID,
    hasMetaAppId: !!META_APP_ID,
    hasMetaAppSecret: !!META_APP_SECRET,
    apiVersion: API_VERSION,
  };
}
