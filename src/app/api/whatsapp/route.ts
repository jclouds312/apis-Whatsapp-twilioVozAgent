import { NextResponse, type NextRequest } from 'next/server';
import { WhatsAppMessageSchema } from '@/lib/schema/whatsapp-message';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

/**
 * Handles the webhook verification for the WhatsApp Business API.
 * 
 * When you configure your webhook in the Meta Developer portal, WhatsApp sends a GET request
 * to your endpoint. This request includes a challenge that your endpoint must echo back to
 * verify its authenticity.
 * 
 * @see https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Check if the mode and token are present and valid
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    // Respond with the challenge to verify the webhook
    return new Response(challenge, { status: 200 });
  } else {
    // If the token is invalid, respond with a 403 Forbidden error
    return NextResponse.json({ error: 'Failed to verify webhook token' }, { status: 403 });
  }
}

/**
 * Handles incoming messages and events from the WhatsApp Business API.
 * 
 * Once the webhook is verified, WhatsApp sends POST requests to this endpoint with
 * notifications about new messages, message status changes, etc.
 * 
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log the entire incoming payload for debugging purposes
    console.log('Received WhatsApp Webhook:', JSON.stringify(body, null, 2));

    const parseResult = WhatsAppMessageSchema.safeParse(body);

    if (!parseResult.success) {
      console.error('Invalid WhatsApp message format:', parseResult.error.flatten());
      // Still return 200 to prevent WhatsApp from resending the webhook
      return NextResponse.json({ status: 'error', message: 'Invalid payload' }, { status: 200 });
    }

    //
    // TODO: Process the message (e.g., save to database, notify frontend)
    //
    const message = parseResult.data.entry[0].changes[0].value.messages?.[0];
    if (message) {
        console.log(`Processing message from ${message.from}: "${message.text.body}"`);
    }

    // WhatsApp requires a 200 OK response to acknowledge receipt of the webhook.
    // Failing to do so will result in WhatsApp resending the notification.
    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error);
    // Return a 500 error but it's often better to return 200 to avoid webhook retries.
    // Depending on the error, you might want to handle it differently.
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}
