
import axios, { AxiosInstance } from 'axios';

export interface MetaWhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  businessAccountId?: string;
  apiVersion?: string;
}

export interface SendTextMessageParams {
  to: string;
  text: string;
  previewUrl?: boolean;
}

export interface SendTemplateMessageParams {
  to: string;
  templateName: string;
  languageCode: string;
  components?: TemplateComponent[];
}

export interface TemplateComponent {
  type: 'header' | 'body' | 'button';
  parameters?: TemplateParameter[];
  sub_type?: string;
  index?: number;
}

export interface TemplateParameter {
  type: 'text' | 'currency' | 'date_time' | 'image' | 'document' | 'video';
  text?: string;
  currency?: { fallback_value: string; code: string; amount_1000: number };
  date_time?: { fallback_value: string };
  image?: { link: string };
  document?: { link: string; filename?: string };
  video?: { link: string };
}

export interface SendMediaMessageParams {
  to: string;
  type: 'image' | 'video' | 'audio' | 'document';
  mediaUrl: string;
  caption?: string;
  filename?: string;
}

export interface SendLocationMessageParams {
  to: string;
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export interface SendContactMessageParams {
  to: string;
  contacts: ContactCard[];
}

export interface ContactCard {
  name: {
    formatted_name: string;
    first_name?: string;
    last_name?: string;
  };
  phones?: Array<{ phone: string; type?: string }>;
  emails?: Array<{ email: string; type?: string }>;
  urls?: Array<{ url: string; type?: string }>;
  addresses?: Array<{
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    country_code?: string;
    type?: string;
  }>;
  org?: {
    company?: string;
    department?: string;
    title?: string;
  };
}

export interface SendInteractiveMessageParams {
  to: string;
  type: 'button' | 'list';
  header?: {
    type: 'text' | 'image' | 'video' | 'document';
    text?: string;
    image?: { link: string };
    video?: { link: string };
    document?: { link: string };
  };
  body: string;
  footer?: string;
  action: InteractiveAction;
}

export interface InteractiveAction {
  buttons?: Array<{
    type: 'reply';
    reply: {
      id: string;
      title: string;
    };
  }>;
  button?: string;
  sections?: Array<{
    title?: string;
    rows: Array<{
      id: string;
      title: string;
      description?: string;
    }>;
  }>;
}

export interface BusinessProfile {
  about?: string;
  address?: string;
  description?: string;
  email?: string;
  messaging_product: string;
  profile_picture_url?: string;
  vertical?: string;
  websites?: string[];
}

export interface MessageTemplate {
  id: string;
  name: string;
  status: string;
  category: string;
  language: string;
  components?: any[];
}

export interface PhoneNumber {
  id: string;
  verified_name: string;
  display_phone_number: string;
  quality_rating: string;
  platform_type: string;
  throughput?: {
    level: string;
  };
  code_verification_status?: string;
  name_status?: string;
}

export interface Webhook {
  callback_url: string;
  verify_token: string;
  fields: string[];
}

export class MetaWhatsAppSDK {
  private client: AxiosInstance;
  private config: MetaWhatsAppConfig;
  private apiVersion: string;

  constructor(config: MetaWhatsAppConfig) {
    this.config = config;
    this.apiVersion = config.apiVersion || 'v22.0';
    
    this.client = axios.create({
      baseURL: `https://graph.facebook.com/${this.apiVersion}`,
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // ==================== MESSAGING METHODS ====================

  async sendTextMessage(params: SendTextMessageParams) {
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: params.to,
      type: 'text',
      text: {
        preview_url: params.previewUrl ?? false,
        body: params.text,
      },
    };

    const response = await this.client.post(
      `/${this.config.phoneNumberId}/messages`,
      payload
    );
    return response.data;
  }

  async sendTemplateMessage(params: SendTemplateMessageParams) {
    const payload: any = {
      messaging_product: 'whatsapp',
      to: params.to,
      type: 'template',
      template: {
        name: params.templateName,
        language: {
          code: params.languageCode,
        },
      },
    };

    if (params.components && params.components.length > 0) {
      payload.template.components = params.components;
    }

    const response = await this.client.post(
      `/${this.config.phoneNumberId}/messages`,
      payload
    );
    return response.data;
  }

  async sendMediaMessage(params: SendMediaMessageParams) {
    const payload: any = {
      messaging_product: 'whatsapp',
      to: params.to,
      type: params.type,
      [params.type]: {
        link: params.mediaUrl,
      },
    };

    if (params.caption) {
      payload[params.type].caption = params.caption;
    }

    if (params.filename && params.type === 'document') {
      payload[params.type].filename = params.filename;
    }

    const response = await this.client.post(
      `/${this.config.phoneNumberId}/messages`,
      payload
    );
    return response.data;
  }

  async sendLocationMessage(params: SendLocationMessageParams) {
    const payload = {
      messaging_product: 'whatsapp',
      to: params.to,
      type: 'location',
      location: {
        latitude: params.latitude,
        longitude: params.longitude,
        name: params.name,
        address: params.address,
      },
    };

    const response = await this.client.post(
      `/${this.config.phoneNumberId}/messages`,
      payload
    );
    return response.data;
  }

  async sendContactMessage(params: SendContactMessageParams) {
    const payload = {
      messaging_product: 'whatsapp',
      to: params.to,
      type: 'contacts',
      contacts: params.contacts,
    };

    const response = await this.client.post(
      `/${this.config.phoneNumberId}/messages`,
      payload
    );
    return response.data;
  }

  async sendInteractiveMessage(params: SendInteractiveMessageParams) {
    const payload: any = {
      messaging_product: 'whatsapp',
      to: params.to,
      type: 'interactive',
      interactive: {
        type: params.type,
        body: {
          text: params.body,
        },
        action: params.action,
      },
    };

    if (params.header) {
      payload.interactive.header = params.header;
    }

    if (params.footer) {
      payload.interactive.footer = {
        text: params.footer,
      };
    }

    const response = await this.client.post(
      `/${this.config.phoneNumberId}/messages`,
      payload
    );
    return response.data;
  }

  async markMessageAsRead(messageId: string) {
    const payload = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    };

    const response = await this.client.post(
      `/${this.config.phoneNumberId}/messages`,
      payload
    );
    return response.data;
  }

  // ==================== MEDIA METHODS ====================

  async uploadMedia(file: Buffer, mimeType: string): Promise<{ id: string }> {
    const formData = new FormData();
    formData.append('messaging_product', 'whatsapp');
    formData.append('file', new Blob([file], { type: mimeType }));
    formData.append('type', mimeType);

    const response = await this.client.post(
      `/${this.config.phoneNumberId}/media`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async getMediaUrl(mediaId: string): Promise<{ url: string; mime_type: string; sha256: string; file_size: number }> {
    const response = await this.client.get(`/${mediaId}`);
    return response.data;
  }

  async downloadMedia(mediaId: string): Promise<ArrayBuffer> {
    const mediaInfo = await this.getMediaUrl(mediaId);
    const response = await axios.get(mediaInfo.url, {
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
      },
      responseType: 'arraybuffer',
    });
    return response.data;
  }

  async deleteMedia(mediaId: string) {
    const response = await this.client.delete(`/${mediaId}`);
    return response.data;
  }

  // ==================== BUSINESS PROFILE METHODS ====================

  async getBusinessProfile(): Promise<{ data: BusinessProfile[] }> {
    const response = await this.client.get(
      `/${this.config.phoneNumberId}/whatsapp_business_profile`,
      {
        params: {
          fields: 'about,address,description,email,profile_picture_url,websites,vertical',
        },
      }
    );
    return response.data;
  }

  async updateBusinessProfile(profile: Partial<BusinessProfile>) {
    const payload = {
      messaging_product: 'whatsapp',
      ...profile,
    };

    const response = await this.client.post(
      `/${this.config.phoneNumberId}/whatsapp_business_profile`,
      payload
    );
    return response.data;
  }

  // ==================== TEMPLATE METHODS ====================

  async getMessageTemplates(limit: number = 100): Promise<{ data: MessageTemplate[]; paging?: any }> {
    if (!this.config.businessAccountId) {
      throw new Error('businessAccountId is required to fetch templates');
    }

    const response = await this.client.get(
      `/${this.config.businessAccountId}/message_templates`,
      {
        params: {
          fields: 'name,status,category,language,components',
          limit,
        },
      }
    );
    return response.data;
  }

  async createMessageTemplate(template: {
    name: string;
    category: string;
    language: string;
    components: any[];
  }) {
    if (!this.config.businessAccountId) {
      throw new Error('businessAccountId is required to create templates');
    }

    const response = await this.client.post(
      `/${this.config.businessAccountId}/message_templates`,
      template
    );
    return response.data;
  }

  async deleteMessageTemplate(templateName: string) {
    if (!this.config.businessAccountId) {
      throw new Error('businessAccountId is required to delete templates');
    }

    const response = await this.client.delete(
      `/${this.config.businessAccountId}/message_templates`,
      {
        params: {
          name: templateName,
        },
      }
    );
    return response.data;
  }

  // ==================== PHONE NUMBER METHODS ====================

  async getPhoneNumberInfo(): Promise<PhoneNumber> {
    const response = await this.client.get(`/${this.config.phoneNumberId}`, {
      params: {
        fields: 'verified_name,display_phone_number,quality_rating,platform_type,throughput,code_verification_status,name_status',
      },
    });
    return response.data;
  }

  async requestVerificationCode(method: 'SMS' | 'VOICE' = 'SMS') {
    const response = await this.client.post(
      `/${this.config.phoneNumberId}/request_code`,
      {
        code_method: method,
      }
    );
    return response.data;
  }

  async verifyCode(code: string) {
    const response = await this.client.post(
      `/${this.config.phoneNumberId}/verify_code`,
      {
        code,
      }
    );
    return response.data;
  }

  // ==================== WEBHOOK METHODS ====================

  async subscribeToWebhook(fields: string[] = ['messages', 'message_deliveries', 'message_reads']) {
    if (!this.config.businessAccountId) {
      throw new Error('businessAccountId is required to subscribe to webhooks');
    }

    const response = await this.client.post(
      `/${this.config.businessAccountId}/subscribed_apps`,
      {
        subscribed_fields: fields,
      }
    );
    return response.data;
  }

  async getWebhookSubscriptions() {
    if (!this.config.businessAccountId) {
      throw new Error('businessAccountId is required to get webhook subscriptions');
    }

    const response = await this.client.get(
      `/${this.config.businessAccountId}/subscribed_apps`
    );
    return response.data;
  }

  // ==================== ANALYTICS METHODS ====================

  async getAnalytics(params: {
    start: number;
    end: number;
    granularity: 'DAY' | 'MONTH';
    metric_types?: string[];
  }) {
    const response = await this.client.get(
      `/${this.config.phoneNumberId}/analytics`,
      {
        params: {
          start: params.start,
          end: params.end,
          granularity: params.granularity,
          metric_types: params.metric_types?.join(','),
        },
      }
    );
    return response.data;
  }

  async getConversationAnalytics(params: {
    start: number;
    end: number;
    granularity: 'DAILY' | 'MONTHLY';
    conversation_types?: string[];
    conversation_directions?: string[];
  }) {
    const response = await this.client.get(
      `/${this.config.phoneNumberId}/conversation_analytics`,
      {
        params,
      }
    );
    return response.data;
  }

  // ==================== COMMERCE METHODS ====================

  async getCatalogs() {
    if (!this.config.businessAccountId) {
      throw new Error('businessAccountId is required to get catalogs');
    }

    const response = await this.client.get(
      `/${this.config.businessAccountId}/owned_product_catalogs`
    );
    return response.data;
  }

  async getProducts(catalogId: string, limit: number = 100) {
    const response = await this.client.get(`/${catalogId}/products`, {
      params: { limit },
    });
    return response.data;
  }

  async sendProductMessage(params: {
    to: string;
    catalogId: string;
    productRetailerId: string;
    body?: string;
    footer?: string;
  }) {
    const payload = {
      messaging_product: 'whatsapp',
      to: params.to,
      type: 'interactive',
      interactive: {
        type: 'product',
        body: params.body ? { text: params.body } : undefined,
        footer: params.footer ? { text: params.footer } : undefined,
        action: {
          catalog_id: params.catalogId,
          product_retailer_id: params.productRetailerId,
        },
      },
    };

    const response = await this.client.post(
      `/${this.config.phoneNumberId}/messages`,
      payload
    );
    return response.data;
  }

  async sendProductListMessage(params: {
    to: string;
    catalogId: string;
    sections: Array<{
      title: string;
      product_items: Array<{ product_retailer_id: string }>;
    }>;
    header?: string;
    body: string;
    footer?: string;
  }) {
    const payload = {
      messaging_product: 'whatsapp',
      to: params.to,
      type: 'interactive',
      interactive: {
        type: 'product_list',
        header: params.header ? { type: 'text', text: params.header } : undefined,
        body: { text: params.body },
        footer: params.footer ? { text: params.footer } : undefined,
        action: {
          catalog_id: params.catalogId,
          sections: params.sections,
        },
      },
    };

    const response = await this.client.post(
      `/${this.config.phoneNumberId}/messages`,
      payload
    );
    return response.data;
  }

  // ==================== QUALITY & COMPLIANCE ====================

  async getQualityRating() {
    const phoneInfo = await this.getPhoneNumberInfo();
    return {
      quality_rating: phoneInfo.quality_rating,
      platform_type: phoneInfo.platform_type,
    };
  }

  async getCurrentLimit() {
    const response = await this.client.get(
      `/${this.config.phoneNumberId}/message_limit`
    );
    return response.data;
  }
}

export default MetaWhatsAppSDK;
