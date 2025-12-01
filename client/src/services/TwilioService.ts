/**
 * Twilio Enterprise Service - Complete API wrapper with account management
 */

const API_BASE = "/api/v1/twilio";

export interface Account {
  sid: string;
  friendlyName: string;
  status: string;
  type: string;
  dateCreated: string;
}

export interface PhoneNumber {
  sid: string;
  phoneNumber: string;
  areaCode: string;
  friendlyName: string;
  voiceUrl?: string;
  smsUrl?: string;
  status: "active" | "inactive";
  capabilities: string[];
}

export interface Campaign {
  id: string;
  name: string;
  type: "sms" | "voice" | "ivr";
  recipients: number;
  sent: number;
  failed: number;
  status: "draft" | "running" | "paused" | "completed";
  createdAt: string;
}

export interface IVRConfig {
  id: string;
  name: string;
  initialMessage: string;
  menu: {
    key: string;
    action: string;
    target?: string;
  }[];
  recordingUrl?: string;
}

export interface CallQueue {
  id: string;
  name: string;
  maxSize: number;
  currentCalls: number;
  avgWaitTime: number;
  createdAt: string;
}

export class TwilioService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // ============= ACCOUNT MANAGEMENT =============
  async createSubAccount(friendlyName: string): Promise<Account> {
    try {
      const response = await fetch(`${API_BASE}/account/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendlyName }),
      });
      if (!response.ok) throw new Error(`Create Account Error: ${response.statusText}`);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to create account: ${error.message}`);
    }
  }

  async getAccounts(): Promise<Account[]> {
    try {
      const response = await fetch(`${API_BASE}/accounts`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      if (!response.ok) throw new Error(`Get Accounts Error: ${response.statusText}`);
      const data = await response.json();
      return data.accounts || [];
    } catch (error: any) {
      throw new Error(`Failed to get accounts: ${error.message}`);
    }
  }

  async updateAccount(accountSid: string, updates: any): Promise<Account> {
    try {
      const response = await fetch(`${API_BASE}/account/${accountSid}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(`Update Account Error: ${response.statusText}`);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to update account: ${error.message}`);
    }
  }

  // ============= PHONE NUMBERS =============
  async buyPhoneNumber(areaCode: string, friendlyName: string): Promise<PhoneNumber> {
    try {
      const response = await fetch(`${API_BASE}/phone-numbers/buy`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ areaCode, friendlyName }),
      });
      if (!response.ok) throw new Error(`Buy Number Error: ${response.statusText}`);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to buy phone number: ${error.message}`);
    }
  }

  async getPhoneNumbers(): Promise<PhoneNumber[]> {
    try {
      const response = await fetch(`${API_BASE}/phone-numbers`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      if (!response.ok) throw new Error(`Get Numbers Error: ${response.statusText}`);
      const data = await response.json();
      return data.numbers || [];
    } catch (error: any) {
      throw new Error(`Failed to get phone numbers: ${error.message}`);
    }
  }

  async updatePhoneNumber(phoneSid: string, updates: Partial<PhoneNumber>): Promise<PhoneNumber> {
    try {
      const response = await fetch(`${API_BASE}/phone-numbers/${phoneSid}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(`Update Number Error: ${response.statusText}`);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to update phone number: ${error.message}`);
    }
  }

  async releasePhoneNumber(phoneSid: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/phone-numbers/${phoneSid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      if (!response.ok) throw new Error(`Release Number Error: ${response.statusText}`);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to release phone number: ${error.message}`);
    }
  }

  // ============= MESSAGING =============
  async sendSMS(to: string, body: string, from?: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/sms`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, body, from }),
      });
      if (!response.ok) throw new Error(`SMS Error: ${response.statusText}`);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  async sendBulkSMS(recipients: string[], body: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/sms/bulk`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipients, body }),
      });
      if (!response.ok) throw new Error(`Bulk SMS Error: ${response.statusText}`);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to send bulk SMS: ${error.message}`);
    }
  }

  // ============= CALLING =============
  async makeCall(to: string, from?: string, recordCall: boolean = true): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/call`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, from, recordCall }),
      });
      if (!response.ok) throw new Error(`Call Error: ${response.statusText}`);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to make call: ${error.message}`);
    }
  }

  async getCallStatus(callSid: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/call/${callSid}`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      if (!response.ok) throw new Error(`Get Status Error: ${response.statusText}`);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to get call status: ${error.message}`);
    }
  }

  async getRecordings(callSid: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE}/recordings/${callSid}`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      if (!response.ok) throw new Error(`Get Recordings Error: ${response.statusText}`);
      const data = await response.json();
      return data.recordings || [];
    } catch (error: any) {
      throw new Error(`Failed to get recordings: ${error.message}`);
    }
  }

  // ============= IVR & CAMPAIGNS =============
  async createIVR(config: IVRConfig): Promise<IVRConfig> {
    try {
      const response = await fetch(`${API_BASE}/ivr/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error(`Create IVR Error: ${response.statusText}`);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to create IVR: ${error.message}`);
    }
  }

  async createSMSCampaign(name: string, recipients: string[], body: string): Promise<Campaign> {
    try {
      const response = await fetch(`${API_BASE}/campaign/sms`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, recipients, body }),
      });
      if (!response.ok) throw new Error(`Create Campaign Error: ${response.statusText}`);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to create campaign: ${error.message}`);
    }
  }

  async getCampaigns(): Promise<Campaign[]> {
    try {
      const response = await fetch(`${API_BASE}/campaigns`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      if (!response.ok) throw new Error(`Get Campaigns Error: ${response.statusText}`);
      const data = await response.json();
      return data.campaigns || [];
    } catch (error: any) {
      throw new Error(`Failed to get campaigns: ${error.message}`);
    }
  }

  // ============= CALL QUEUES =============
  async createCallQueue(name: string, maxSize: number): Promise<CallQueue> {
    try {
      const response = await fetch(`${API_BASE}/queue/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, maxSize }),
      });
      if (!response.ok) throw new Error(`Create Queue Error: ${response.statusText}`);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to create call queue: ${error.message}`);
    }
  }

  async getCallQueues(): Promise<CallQueue[]> {
    try {
      const response = await fetch(`${API_BASE}/queues`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      if (!response.ok) throw new Error(`Get Queues Error: ${response.statusText}`);
      const data = await response.json();
      return data.queues || [];
    } catch (error: any) {
      throw new Error(`Failed to get call queues: ${error.message}`);
    }
  }
}

let twilioServiceInstance: TwilioService | null = null;

export function initializeTwilioService(apiKey: string): TwilioService {
  if (!twilioServiceInstance) {
    twilioServiceInstance = new TwilioService(apiKey);
  }
  return twilioServiceInstance;
}

export function getTwilioService(): TwilioService {
  if (!twilioServiceInstance) {
    throw new Error("Twilio service not initialized");
  }
  return twilioServiceInstance;
}
