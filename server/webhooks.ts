import type { Request, Response } from "express";
import { storage } from "./storage";

// WhatsApp Webhook Handler
export async function handleWhatsAppWebhook(req: Request, res: Response) {
  const { object, entry } = req.body;

  if (object === "whatsapp_business_account") {
    for (const item of entry) {
      for (const change of item.changes) {
        const value = change.value;

        if (value.messages) {
          for (const message of value.messages) {
            await storage.createWhatsappMessage({
              userId: "admin", // Link to admin user
              phoneNumber: value.metadata.phone_number_id,
              recipientPhone: message.from,
              message: message.type === "text" ? message.text.body : `[${message.type}]`,
              status: "delivered",
              direction: "inbound",
              externalId: message.id,
            });

            await storage.createSystemLog({
              eventType: "whatsapp_message_received",
              service: "whatsapp",
              message: `Inbound WhatsApp from ${message.from}`,
              status: "info",
              metadata: { messageId: message.id, sender: message.from },
            });
          }
        }

        if (value.statuses) {
          for (const status of value.statuses) {
            // Update message status in database
            await storage.updateWhatsappMessage(status.id, {
              status: status.status,
            });
          }
        }
      }
    }
    res.status(200).json({ ok: true });
  }
}

// Twilio Webhook Handler
export async function handleTwilioWebhook(req: Request, res: Response) {
  const { CallSid, CallStatus, From, To, RecordingUrl } = req.body;

  const call = await storage.getTwilioCallByCallSid(CallSid);
  if (call) {
    await storage.updateTwilioCall(call.id, {
      status: CallStatus,
      recordingUrl: RecordingUrl,
    });
  }

  await storage.createSystemLog({
    eventType: "call_status_update",
    service: "twilio",
    message: `Call ${CallSid}: ${CallStatus}`,
    status: "info",
    metadata: { callSid: CallSid, status: CallStatus },
  });

  res.status(200).json({ ok: true });
}

// Verify webhook tokens
export function verifyWebhookToken(token: string, expectedToken: string): boolean {
  return token === expectedToken;
}
