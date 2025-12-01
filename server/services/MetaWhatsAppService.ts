import axios, { AxiosInstance } from "axios";

interface MessageTemplate {
  name: string;
  components: Array<{
    type: "HEADER" | "BODY" | "FOOTER";
    format?: string;
    text?: string;
  }>;
  language: string;
  status: string;
  category: string;
  id: string;
}

interface WABAInfo {
  id: string;
  name: string;
  message_templates: {
    data: MessageTemplate[];
  };
  phone_numbers: {
    data: Array<{
      id: string;
      display_phone_number: string;
      phone_number_id: string;
      quality_rating: string;
    }>;
  };
}

export class MetaWhatsAppService {
  private client: AxiosInstance;
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.client = axios.create({
      baseURL: "https://graph.facebook.com/v21.0",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  // Get WABA info including templates and phone numbers
  async getWABAInfo(wabaId: string): Promise<WABAInfo> {
    try {
      const response = await this.client.get(
        `/${wabaId}?fields=id,name,message_templates,phone_numbers`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch WABA info: ${error.message}`);
    }
  }

  // Get all message templates
  async getMessageTemplates(wabaId: string): Promise<MessageTemplate[]> {
    try {
      const response = await this.client.get(
        `/${wabaId}/message_templates?fields=name,status,category,language,components`
      );
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(`Failed to fetch templates: ${error.message}`);
    }
  }

  // Create new message template
  async createMessageTemplate(
    wabaId: string,
    template: {
      name: string;
      language: string;
      category: string;
      components: any[];
    }
  ) {
    try {
      const response = await this.client.post(`/${wabaId}/message_templates`, template);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create template: ${error.message}`);
    }
  }

  // Get phone numbers linked to WABA
  async getPhoneNumbers(wabaId: string) {
    try {
      const response = await this.client.get(
        `/${wabaId}/phone_numbers?fields=id,display_phone_number,phone_number_id,quality_rating`
      );
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(`Failed to fetch phone numbers: ${error.message}`);
    }
  }

  // Send message using template
  async sendTemplateMessage(
    phoneNumberId: string,
    recipientPhone: string,
    templateName: string,
    language: string = "es",
    parameters: string[] = []
  ) {
    try {
      const response = await this.client.post(`/${phoneNumberId}/messages`, {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipientPhone,
        type: "template",
        template: {
          name: templateName,
          language: { code: language },
          ...(parameters.length && {
            components: [
              {
                type: "body",
                parameters: parameters.map((p) => ({ type: "text", text: p })),
              },
            ],
          }),
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to send template message: ${error.message}`);
    }
  }

  // Send text message
  async sendTextMessage(
    phoneNumberId: string,
    recipientPhone: string,
    message: string
  ) {
    try {
      const response = await this.client.post(`/${phoneNumberId}/messages`, {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipientPhone,
        type: "text",
        text: { body: message },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to send text message: ${error.message}`);
    }
  }

  // Get message status
  async getMessageStatus(messageId: string) {
    try {
      const response = await this.client.get(
        `/${messageId}?fields=id,status,timestamp,type,recipient_id`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get message status: ${error.message}`);
    }
  }
}
