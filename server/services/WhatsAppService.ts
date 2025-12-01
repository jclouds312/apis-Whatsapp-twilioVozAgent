import axios, { AxiosInstance } from "axios";
import { storage } from "../storage";

const ADMIN_PHONE = "8622770131"; // Meta WhatsApp format without +

interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  businessAccountId: string;
}

interface MessagePayload {
  messaging_product: string;
  recipient_type: string;
  to: string;
  type: string;
  text?: { body: string };
  template?: {
    name: string;
    language: { code: string };
    components?: Array<{
      type: string;
      parameters?: Array<{ type: string; text: string }>;
    }>;
  };
}

export class WhatsAppService {
  private client: AxiosInstance;
  private config: WhatsAppConfig;
  private apiVersion = "v18.0";

  constructor(config: WhatsAppConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: `https://graph.instagram.com/${this.apiVersion}`,
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  async sendMessage(toNumber: string, message: string, userId: string, isTemplate = false) {
    try {
      const payload: MessagePayload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: this.formatPhoneNumber(toNumber),
        type: isTemplate ? "template" : "text",
      };

      if (!isTemplate) {
        payload.text = { body: message };
      } else {
        payload.template = {
          name: message,
          language: { code: "en_US" },
        };
      }

      const response = await this.client.post(
        `/${this.config.phoneNumberId}/messages`,
        payload
      );

      // Log message to database
      await storage.createWhatsappMessage({
        userId,
        phoneNumber: this.config.phoneNumberId,
        recipientPhone: toNumber,
        message: isTemplate ? `Template: ${message}` : message,
        status: "sent",
        direction: "outbound",
        externalId: response.data.messages[0].id,
      });

      // Log event
      await storage.createSystemLog({
        userId,
        eventType: "whatsapp_message_sent",
        service: "whatsapp",
        message: `Message sent to ${toNumber}`,
        status: "success",
        metadata: { messageId: response.data.messages[0].id, recipient: toNumber },
      });

      return response.data;
    } catch (error: any) {
      await storage.createSystemLog({
        userId,
        eventType: "whatsapp_message_failed",
        service: "whatsapp",
        message: `Failed to send message to ${toNumber}: ${error.response?.data?.error?.message || error.message}`,
        status: "error",
        metadata: { error: error.response?.data, recipient: toNumber },
      });
      throw error;
    }
  }

  async sendTemplate(
    toNumber: string,
    templateName: string,
    languageCode: string,
    parameters: string[],
    userId: string
  ) {
    try {
      const payload: MessagePayload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: this.formatPhoneNumber(toNumber),
        type: "template",
        template: {
          name: templateName,
          language: { code: languageCode },
          components: parameters.length
            ? [
                {
                  type: "body",
                  parameters: parameters.map((param) => ({ type: "text", text: param })),
                },
              ]
            : undefined,
        },
      };

      const response = await this.client.post(
        `/${this.config.phoneNumberId}/messages`,
        payload
      );

      await storage.createWhatsappMessage({
        userId,
        phoneNumber: this.config.phoneNumberId,
        recipientPhone: toNumber,
        message: `Template: ${templateName}`,
        status: "sent",
        direction: "outbound",
        externalId: response.data.messages[0].id,
      });

      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async getTemplates() {
    try {
      const response = await this.client.get(`/${this.config.businessAccountId}/message_templates`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getMessageStatus(messageId: string) {
    try {
      const response = await this.client.get(`/${messageId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async registerPhoneNumber(phoneNumber: string, pinCode: string) {
    try {
      const response = await this.client.post(
        `/${this.config.phoneNumberId}/register`,
        {
          messaging_product: "whatsapp",
          pin: pinCode,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async verifyPhoneNumber(verificationCode: string) {
    try {
      const response = await this.client.post(
        `/${this.config.phoneNumberId}/verify`,
        {
          code: verificationCode,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters and ensure country code
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return "1" + cleaned; // Add US country code
    }
    return cleaned;
  }

  static getAdminPhone(): string {
    return ADMIN_PHONE;
  }

  static isAdminPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned === ADMIN_PHONE || cleaned.endsWith(ADMIN_PHONE);
  }
}

export const createWhatsAppService = (
  phoneNumberId: string,
  accessToken: string,
  businessAccountId: string
) => {
  return new WhatsAppService({ phoneNumberId, accessToken, businessAccountId });
};
