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
  message_templates?: {
    data: MessageTemplate[];
  };
  phone_numbers?: {
    data: any[];
  };
}

interface PhoneNumber {
  id: string;
  display_phone_number: string;
  phone_number_id: string;
  quality_rating: string;
}

interface AssignedUser {
  id: string;
  name: string;
  email: string;
}

interface ExtendedCredit {
  id: string;
  owner_id: string;
  owner_name: string;
  owning_credit_allocation_configs: any[];
  display_string: string;
  currency: string;
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

  // ============= WABA OPERATIONS =============
  // GET WABA info
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

  // ============= ASSIGNED USERS =============
  // GET assigned users
  async getAssignedUsers(wabaId: string): Promise<AssignedUser[]> {
    try {
      const response = await this.client.get(`/${wabaId}/assigned_users`);
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(`Failed to fetch assigned users: ${error.message}`);
    }
  }

  // POST assign user to WABA
  async assignUser(wabaId: string, userId: string, role: string = "ADMIN") {
    try {
      const response = await this.client.post(`/${wabaId}/assigned_users`, {
        user_id: userId,
        role,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to assign user: ${error.message}`);
    }
  }

  // DELETE assigned user
  async removeAssignedUser(wabaId: string, userId: string) {
    try {
      const response = await this.client.delete(`/${wabaId}/assigned_users`, {
        data: { user_id: userId },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to remove assigned user: ${error.message}`);
    }
  }

  // ============= PHONE NUMBERS =============
  // GET phone numbers
  async getPhoneNumbers(wabaId: string): Promise<PhoneNumber[]> {
    try {
      const response = await this.client.get(
        `/${wabaId}/phone_numbers?fields=id,display_phone_number,phone_number_id,quality_rating,verification_status,platform_type,name_status`
      );
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(`Failed to fetch phone numbers: ${error.message}`);
    }
  }

  // ============= MESSAGE TEMPLATES =============
  // GET all message templates
  async getMessageTemplates(wabaId: string): Promise<MessageTemplate[]> {
    try {
      const response = await this.client.get(
        `/${wabaId}/message_templates?fields=name,status,category,language,components,id`
      );
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(`Failed to fetch templates: ${error.message}`);
    }
  }

  // POST create message template
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

  // DELETE message template
  async deleteMessageTemplate(wabaId: string, templateName: string) {
    try {
      const response = await this.client.delete(`/${wabaId}/message_templates`, {
        data: { name: templateName },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to delete template: ${error.message}`);
    }
  }

  // ============= SUBSCRIBED APPS =============
  // GET subscribed apps
  async getSubscribedApps(wabaId: string) {
    try {
      const response = await this.client.get(`/${wabaId}/subscribed_apps`);
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(`Failed to fetch subscribed apps: ${error.message}`);
    }
  }

  // POST subscribe app to WABA
  async subscribeApp(wabaId: string, appId: string) {
    try {
      const response = await this.client.post(`/${wabaId}/subscribed_apps`, {
        app_id: appId,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to subscribe app: ${error.message}`);
    }
  }

  // DELETE unsubscribe app
  async unsubscribeApp(wabaId: string, appId: string) {
    try {
      const response = await this.client.delete(`/${wabaId}/subscribed_apps`, {
        data: { app_id: appId },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to unsubscribe app: ${error.message}`);
    }
  }

  // ============= EXTENDED CREDITS =============
  // GET extended credits for business
  async getExtendedCredits(businessId: string): Promise<ExtendedCredit[]> {
    try {
      const response = await this.client.get(
        `/${businessId}/extendedcredits?fields=id,owner_id,owner_name,owning_credit_allocation_configs,display_string,currency`
      );
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(`Failed to fetch extended credits: ${error.message}`);
    }
  }

  // POST share WhatsApp credit
  async shareWhatsAppCredit(extendedCreditId: string, creditData: any) {
    try {
      const response = await this.client.post(
        `/${extendedCreditId}/whatsapp_credit_sharing_and_attach`,
        creditData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to share WhatsApp credit: ${error.message}`);
    }
  }

  // GET allocation config
  async getAllocationConfig(allocationConfigId: string) {
    try {
      const response = await this.client.get(
        `/${allocationConfigId}?fields=id,credit_type,amount,owner_id`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch allocation config: ${error.message}`);
    }
  }

  // DELETE allocation config
  async deleteAllocationConfig(allocationConfigId: string) {
    try {
      const response = await this.client.delete(`/${allocationConfigId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to delete allocation config: ${error.message}`);
    }
  }

  // GET owning credit allocation configs
  async getOwningCreditAllocationConfigs(extendedCreditId: string) {
    try {
      const response = await this.client.get(
        `/${extendedCreditId}/owning_credit_allocation_configs?fields=id,credit_type,amount,recipient_id,status`
      );
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(`Failed to fetch credit allocation configs: ${error.message}`);
    }
  }

  // ============= MESSAGING =============
  // Send template message
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
