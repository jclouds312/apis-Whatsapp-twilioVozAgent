import { z } from 'zod';

// Defines the structure for a text message
const TextSchema = z.object({
  body: z.string(),
});

// Defines the structure for a message object
const MessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  text: TextSchema,
  type: z.literal('text'),
});

// Defines the structure of a contact profile
const ContactProfileSchema = z.object({
  name: z.string(),
});

// Defines the structure of a contact
const ContactSchema = z.object({
  profile: ContactProfileSchema,
  wa_id: z.string(),
});

// Defines the structure of the `value` object within a change
const ValueSchema = z.object({
  messaging_product: z.literal('whatsapp'),
  metadata: z.object({
    display_phone_number: z.string(),
    phone_number_id: z.string(),
  }),
  contacts: z.array(ContactSchema).optional(),
  messages: z.array(MessageSchema).optional(),
  statuses: z.any().optional(), 
});

// Defines the structure of a single change
const ChangeSchema = z.object({
  value: ValueSchema,
  field: z.literal('messages'),
});

// Defines the structure for an entry in the webhook payload
const EntrySchema = z.object({
  id: z.string(),
  changes: z.array(ChangeSchema),
});

// The main schema for the entire WhatsApp message payload
export const WhatsAppMessageSchema = z.object({
  object: z.literal('whatsapp_business_account'),
  entry: z.array(EntrySchema),
});

export type WhatsAppMessage = z.infer<typeof WhatsAppMessageSchema>;
export type Message = z.infer<typeof MessageSchema>;
