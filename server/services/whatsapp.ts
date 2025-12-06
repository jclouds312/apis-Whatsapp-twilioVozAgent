
import axios from 'axios';

export class WhatsAppService {
  private apiUrl: string;
  private accessToken: string;
  private phoneNumberId: string;

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  }

  async sendMessage(to: string, message: string, type: string = 'text') {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type,
          text: { body: message },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to send message: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async sendTemplate(to: string, templateName: string, language: string, components: any[]) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'template',
          template: {
            name: templateName,
            language: { code: language },
            components,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to send template: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async handleWebhook(body: any) {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (value?.messages) {
      for (const message of value.messages) {
        await this.processIncomingMessage(message, value.metadata);
      }
    }

    if (value?.statuses) {
      for (const status of value.statuses) {
        await this.processMessageStatus(status);
      }
    }
  }

  private async processIncomingMessage(message: any, metadata: any) {
    console.log('Incoming message:', {
      from: message.from,
      type: message.type,
      timestamp: message.timestamp,
      text: message.text?.body,
    });
    // Implement your message processing logic here
  }

  private async processMessageStatus(status: any) {
    console.log('Message status:', {
      id: status.id,
      status: status.status,
      timestamp: status.timestamp,
    });
    // Implement your status processing logic here
  }

  async getMessageStatus(messageId: string) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/${messageId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get message status: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async uploadMedia(url: string, mimeType: string) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/media`,
        {
          messaging_product: 'whatsapp',
          url,
          mime_type: mimeType,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.id;
    } catch (error: any) {
      throw new Error(`Failed to upload media: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}
