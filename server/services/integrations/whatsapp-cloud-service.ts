
import axios from 'axios';

export class WhatsAppCloudService {
  private apiUrl: string;
  private accessToken: string;
  private phoneNumberId: string;
  private businessAccountId: string;

  constructor() {
    this.apiUrl = process.env.WHATSAPP_CLOUD_API_URL || 'https://graph.facebook.com/v21.0';
    this.accessToken = process.env.WHATSAPP_CLOUD_ACCESS_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID || '';
    this.businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '';
  }

  async sendInteractiveMessage(to: string, interactive: any) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: 'interactive',
          interactive
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`WhatsApp Cloud API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async sendTemplateMessage(to: string, templateName: string, language: string, components: any[]) {
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
            components
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`WhatsApp Template error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async uploadMedia(mediaUrl: string, mimeType: string) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/media`,
        {
          messaging_product: 'whatsapp',
          file: mediaUrl,
          type: mimeType
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Media upload error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async createFlow(name: string, categories: string[]) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.businessAccountId}/flows`,
        {
          name,
          categories
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Flow creation error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}
