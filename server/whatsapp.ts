
import axios from "axios";

interface WhatsAppMessage {
  phoneNumberId: string;
  accessToken: string;
  to: string;
  message: string;
  type?: string;
  mediaUrl?: string;
}

interface WhatsAppResponse {
  messaging_product: string;
  contacts: Array<{ input: string; wa_id: string }>;
  messages: Array<{ id: string }>;
}

export class WhatsAppService {
  private readonly GRAPH_API_URL = "https://graph.facebook.com/v18.0";

  async sendTextMessage(params: WhatsAppMessage): Promise<WhatsAppResponse> {
    const { phoneNumberId, accessToken, to, message } = params;
    
    try {
      const response = await axios.post(
        `${this.GRAPH_API_URL}/${phoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to.replace(/[^0-9]/g, ""), // Remove non-numeric chars
          type: "text",
          text: {
            preview_url: false,
            body: message
          }
        },
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      return response.data;
    } catch (error: any) {
      console.error("WhatsApp API Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || "Failed to send WhatsApp message");
    }
  }

  async sendMediaMessage(params: WhatsAppMessage): Promise<WhatsAppResponse> {
    const { phoneNumberId, accessToken, to, message, mediaUrl, type = "image" } = params;
    
    try {
      const response = await axios.post(
        `${this.GRAPH_API_URL}/${phoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to.replace(/[^0-9]/g, ""),
          type: type,
          [type]: {
            link: mediaUrl,
            caption: message
          }
        },
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      return response.data;
    } catch (error: any) {
      console.error("WhatsApp Media API Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || "Failed to send media message");
    }
  }

  async sendTemplateMessage(params: {
    phoneNumberId: string;
    accessToken: string;
    to: string;
    templateName: string;
    languageCode?: string;
    components?: any[];
  }): Promise<WhatsAppResponse> {
    const { phoneNumberId, accessToken, to, templateName, languageCode = "en", components = [] } = params;
    
    try {
      const response = await axios.post(
        `${this.GRAPH_API_URL}/${phoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          to: to.replace(/[^0-9]/g, ""),
          type: "template",
          template: {
            name: templateName,
            language: {
              code: languageCode
            },
            components: components
          }
        },
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      return response.data;
    } catch (error: any) {
      console.error("WhatsApp Template API Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || "Failed to send template message");
    }
  }

  async markMessageAsRead(params: {
    phoneNumberId: string;
    accessToken: string;
    messageId: string;
  }): Promise<{ success: boolean }> {
    const { phoneNumberId, accessToken, messageId } = params;
    
    try {
      await axios.post(
        `${this.GRAPH_API_URL}/${phoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          status: "read",
          message_id: messageId
        },
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      return { success: true };
    } catch (error: any) {
      console.error("WhatsApp Mark Read Error:", error.response?.data || error.message);
      throw new Error("Failed to mark message as read");
    }
  }

  parseWebhookMessage(webhookData: any) {
    try {
      const entry = webhookData.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      
      if (!value) return null;

      // Handle incoming messages
      if (value.messages && value.messages.length > 0) {
        const message = value.messages[0];
        return {
          type: "message",
          messageId: message.id,
          from: message.from,
          timestamp: message.timestamp,
          messageType: message.type,
          text: message.text?.body,
          mediaUrl: message.image?.link || message.video?.link || message.document?.link,
          contacts: value.contacts?.[0]
        };
      }

      // Handle status updates
      if (value.statuses && value.statuses.length > 0) {
        const status = value.statuses[0];
        return {
          type: "status",
          messageId: status.id,
          status: status.status, // sent, delivered, read, failed
          timestamp: status.timestamp,
          recipientId: status.recipient_id
        };
      }

      return null;
    } catch (error) {
      console.error("Error parsing webhook:", error);
      return null;
    }
  }
}

export const whatsappService = new WhatsAppService();
