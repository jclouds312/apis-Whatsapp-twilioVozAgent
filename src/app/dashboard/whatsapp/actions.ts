'use server'

import axios from 'axios';

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const API_VERSION = 'v20.0';

if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
  console.error('WhatsApp environment variables are not set.');
}

/**
 * Sends a message through the WhatsApp Business API.
 * @param to The recipient's phone number.
 * @param text The content of the message.
 * @returns An object indicating success or failure.
 */
export async function sendWhatsAppMessage(to: string, text: string): Promise<{ success: boolean; error?: string }> {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    const errorMessage = 'Server is not configured for sending WhatsApp messages.';
    console.error(errorMessage);
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
    'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(url, payload, { headers });
    console.log('WhatsApp message sent successfully:', response.data);
    return { success: true };
  } catch (error: any) {
    const errorMessage = error.response?.data?.error?.message || error.message || 'An unknown error occurred.';
    console.error('Failed to send WhatsApp message:', errorMessage);
    return { success: false, error: errorMessage };
  }
}
