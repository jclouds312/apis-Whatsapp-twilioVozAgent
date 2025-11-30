'use server';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';
import { getFirestore } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '882779844920111';
const META_APP_ID = process.env.META_APP_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;
const API_VERSION = 'v22.0';
const DEFAULT_RECIPIENT = '573205434546';

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
  phoneNumberId: string;
  defaultRecipient: string;
}> {
  return {
    isConfigured: !!(WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_NUMBER_ID),
    hasAccessToken: !!WHATSAPP_ACCESS_TOKEN,
    hasPhoneNumberId: !!WHATSAPP_PHONE_NUMBER_ID,
    hasMetaAppId: !!META_APP_ID,
    hasMetaAppSecret: !!META_APP_SECRET,
    apiVersion: API_VERSION,
    phoneNumberId: WHATSAPP_PHONE_NUMBER_ID,
    defaultRecipient: DEFAULT_RECIPIENT,
  };
}

/**
 * Gets the phone number information from WhatsApp Business API.
 * @returns Phone number details or an error.
 */
export async function getPhoneNumberInfo(): Promise<{
  success: boolean;
  error?: string;
  phoneNumber?: {
    verified_name?: string;
    display_phone_number?: string;
    quality_rating?: string;
    platform_type?: string;
    throughput?: { level: string };
    id?: string;
  };
}> {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    return { success: false, error: 'Server is not configured for WhatsApp API.' };
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}?fields=verified_name,display_phone_number,quality_rating,platform_type,throughput`;

  const headers = {
    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
  };

  try {
    const response = await axios.get(url, { headers });
    console.log('Phone number info fetched:', response.data);
    return { success: true, phoneNumber: response.data };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      'An unknown error occurred.';
    console.error('Failed to get phone number info:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Gets available message templates from WhatsApp Business API.
 * @returns List of templates or an error.
 */
export async function getMessageTemplates(): Promise<{
  success: boolean;
  error?: string;
  templates?: Array<{
    name: string;
    status: string;
    category: string;
    language: string;
    id: string;
  }>;
}> {
  if (!WHATSAPP_ACCESS_TOKEN || !META_APP_ID) {
    return { success: false, error: 'Server is not configured for WhatsApp API. Need META_APP_ID.' };
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${META_APP_ID}/message_templates?fields=name,status,category,language`;

  const headers = {
    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
  };

  try {
    const response = await axios.get(url, { headers });
    console.log('Templates fetched:', response.data);
    return { 
      success: true, 
      templates: response.data.data?.map((t: any) => ({
        name: t.name,
        status: t.status,
        category: t.category,
        language: t.language,
        id: t.id
      })) || []
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      'An unknown error occurred.';
    console.error('Failed to get templates:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Quick send a hello_world template message.
 * Uses the default configuration from environment.
 * @param to Optional recipient phone number, defaults to configured recipient.
 * @returns An object indicating success or failure.
 */
export async function sendQuickHelloWorld(
  to?: string
): Promise<{ success: boolean; error?: string; messageId?: string; curlCommand?: string }> {
  const recipient = to || DEFAULT_RECIPIENT;
  
  const curlCommand = `curl -i -X POST \\
  https://graph.facebook.com/${API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages \\
  -H 'Authorization: Bearer <access_token>' \\
  -H 'Content-Type: application/json' \\
  -d '{ "messaging_product": "whatsapp", "to": "${recipient}", "type": "template", "template": { "name": "hello_world", "language": { "code": "en_US" } } }'`;

  const result = await sendWhatsAppTemplate(recipient, 'hello_world', 'en_US');
  
  return {
    ...result,
    curlCommand
  };
}

/**
 * Gets message statistics from the API logs in Firestore.
 * @returns Message statistics or an error.
 */
export async function getMessageStats(): Promise<{
  success: boolean;
  error?: string;
  stats?: {
    totalSent: number;
    totalReceived: number;
    totalErrors: number;
    last24Hours: {
      sent: number;
      received: number;
      errors: number;
    };
  };
}> {
  try {
    const db = await getDb();
    const logsCollection = collection(db, 'apiLogs');
    
    const { getDocs, query, where } = await import('firebase/firestore');
    
    const allLogsQuery = query(logsCollection, where('endpoint', 'in', ['/api/whatsapp', 'WhatsApp Webhook']));
    const snapshot = await getDocs(allLogsQuery);
    
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    let totalSent = 0;
    let totalReceived = 0;
    let totalErrors = 0;
    let sent24h = 0;
    let received24h = 0;
    let errors24h = 0;
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const logDate = new Date(data.timestamp);
      const isRecent = logDate >= last24Hours;
      
      if (data.endpoint === '/api/whatsapp') {
        totalSent++;
        if (isRecent) sent24h++;
      } else if (data.endpoint === 'WhatsApp Webhook') {
        totalReceived++;
        if (isRecent) received24h++;
      }
      
      if (data.level === 'error') {
        totalErrors++;
        if (isRecent) errors24h++;
      }
    });
    
    return {
      success: true,
      stats: {
        totalSent,
        totalReceived,
        totalErrors,
        last24Hours: {
          sent: sent24h,
          received: received24h,
          errors: errors24h
        }
      }
    };
  } catch (error: any) {
    console.error('Failed to get message stats:', error);
    return { success: false, error: error.message };
  }
}
