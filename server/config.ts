// Admin Configuration
export const ADMIN_CONFIG = {
  TWILIO_PHONE: "+18622770131",
  WHATSAPP_PHONE: "8622770131",
  MAX_MESSAGE_LENGTH: 4096,
  RATE_LIMIT: {
    MESSAGES_PER_MINUTE: 60,
    CALLS_PER_MINUTE: 30,
  },
  WEBHOOK_TIMEOUT: 30000,
};

// Environment Variables Required
export const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_PHONE_NUMBER",
  "WHATSAPP_PHONE_ID",
  "WHATSAPP_ACCESS_TOKEN",
  "WHATSAPP_BUSINESS_ACCOUNT_ID",
  "WHATSAPP_WEBHOOK_TOKEN",
];

export const getConfig = () => ({
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID!,
    authToken: process.env.TWILIO_AUTH_TOKEN!,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || ADMIN_CONFIG.TWILIO_PHONE,
  },
  whatsapp: {
    phoneNumberId: process.env.WHATSAPP_PHONE_ID!,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || "",
    webhookToken: process.env.WHATSAPP_WEBHOOK_TOKEN || "verify_token_12345",
  },
});
