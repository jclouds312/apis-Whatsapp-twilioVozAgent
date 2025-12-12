
import axios from 'axios';

interface WhatsAppBusinessConfig {
  phoneNumberId: string;
  accessToken: string;
  apiVersion: string;
}

interface MessageTemplate {
  name: string;
  language: string;
  components?: any[];
}

interface MediaMessage {
  type: 'image' | 'video' | 'document' | 'audio';
  url?: string;
  id?: string;
  caption?: string;
  filename?: string;
}

export class WhatsAppBusinessAPI {
  private config: WhatsAppBusinessConfig;
  private baseUrl: string;

  constructor(config?: Partial<WhatsAppBusinessConfig>) {
    this.config = {
      phoneNumberId: config?.phoneNumberId || process.env.WA_PHONE_NUMBER_ID || '',
      accessToken: config?.accessToken || process.env.WA_ACCESS_TOKEN || '',
      apiVersion: config?.apiVersion || 'v21.0'
    };
    this.baseUrl = `https://graph.facebook.com/${this.config.apiVersion}`;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.config.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  async sendTextMessage(to: string, message: string) {
    const url = `${this.baseUrl}/${this.config.phoneNumberId}/messages`;
    
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'text',
      text: { body: message }
    };

    try {
      const response = await axios.post(url, payload, { headers: this.getHeaders() });
      return response.data;
    } catch (error: any) {
      console.error('Error sending WhatsApp message:', error.response?.data || error.message);
      throw error;
    }
  }

  async sendTemplate(to: string, template: MessageTemplate) {
    const url = `${this.baseUrl}/${this.config.phoneNumberId}/messages`;
    
    const payload = {
      messaging_product: 'whatsapp',
      to: to,
      type: 'template',
      template: {
        name: template.name,
        language: { code: template.language },
        components: template.components || []
      }
    };

    try {
      const response = await axios.post(url, payload, { headers: this.getHeaders() });
      return response.data;
    } catch (error: any) {
      console.error('Error sending template:', error.response?.data || error.message);
      throw error;
    }
  }

  async sendMediaMessage(to: string, media: MediaMessage) {
    const url = `${this.baseUrl}/${this.config.phoneNumberId}/messages`;
    
    const mediaPayload: any = {
      messaging_product: 'whatsapp',
      to: to,
      type: media.type
    };

    mediaPayload[media.type] = media.url 
      ? { link: media.url, caption: media.caption }
      : { id: media.id, caption: media.caption };

    if (media.type === 'document' && media.filename) {
      mediaPayload[media.type].filename = media.filename;
    }

    try {
      const response = await axios.post(url, mediaPayload, { headers: this.getHeaders() });
      return response.data;
    } catch (error: any) {
      console.error('Error sending media:', error.response?.data || error.message);
      throw error;
    }
  }

  async uploadMedia(file: Buffer, mimeType: string) {
    const url = `${this.baseUrl}/${this.config.phoneNumberId}/media`;
    
    const formData = new FormData();
    formData.append('messaging_product', 'whatsapp');
    formData.append('file', new Blob([file], { type: mimeType }));

    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error uploading media:', error.response?.data || error.message);
      throw error;
    }
  }

  async markAsRead(messageId: string) {
    const url = `${this.baseUrl}/${this.config.phoneNumberId}/messages`;
    
    const payload = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId
    };

    try {
      const response = await axios.post(url, payload, { headers: this.getHeaders() });
      return response.data;
    } catch (error: any) {
      console.error('Error marking message as read:', error.response?.data || error.message);
      throw error;
    }
  }

  async getMediaUrl(mediaId: string) {
    const url = `${this.baseUrl}/${mediaId}`;
    
    try {
      const response = await axios.get(url, { headers: this.getHeaders() });
      return response.data.url;
    } catch (error: any) {
      console.error('Error getting media URL:', error.response?.data || error.message);
      throw error;
    }
  }

  async downloadMedia(mediaUrl: string) {
    try {
      const response = await axios.get(mediaUrl, {
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
        },
        responseType: 'arraybuffer'
      });
      return Buffer.from(response.data);
    } catch (error: any) {
      console.error('Error downloading media:', error.response?.data || error.message);
      throw error;
    }
  }

  isConfigured(): boolean {
    return !!(this.config.phoneNumberId && this.config.accessToken);
  }
}

export const whatsAppBusinessAPI = new WhatsAppBusinessAPI();
