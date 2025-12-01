/**
 * Twilio Service - Promise-based wrapper for Twilio Voice & SMS APIs
 */

const API_BASE = "/api/v1/twilio";

export interface SendSMSOptions {
  to: string;
  body: string;
}

export interface SendVoiceOptions {
  to: string;
  message: string;
  voice?: "Alice" | "Woman" | "Man";
}

export interface MakeCallOptions {
  to: string;
  recordCall?: boolean;
  maxDuration?: number;
}

export interface CallStatus {
  callSid: string;
  status: string;
  duration?: number;
  startTime?: string;
  endTime?: string;
}

export interface Recording {
  recordingSid: string;
  callSid: string;
  duration: number;
  url: string;
  dateCreated: string;
}

export interface PhoneExtension {
  extensionId: string;
  number: string;
  displayName: string;
  capabilities: string[];
}

export class TwilioService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Send SMS message
   */
  async sendSMS(options: SendSMSOptions): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/sms`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) throw new Error(`SMS Send Error: ${response.statusText}`);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  /**
   * Send voice message
   */
  async sendVoiceMessage(options: SendVoiceOptions): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/voice-message`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...options,
          voice: options.voice || "Alice",
        }),
      });

      if (!response.ok) throw new Error(`Voice Message Error: ${response.statusText}`);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to send voice message: ${error.message}`);
    }
  }

  /**
   * Make outbound call
   */
  async makeCall(options: MakeCallOptions): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/call`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: options.to,
          recordCall: options.recordCall ?? true,
          maxDuration: options.maxDuration || 3600,
        }),
      });

      if (!response.ok) throw new Error(`Call Error: ${response.statusText}`);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to initiate call: ${error.message}`);
    }
  }

  /**
   * Get call status
   */
  async getCallStatus(callSid: string): Promise<CallStatus> {
    try {
      const response = await fetch(`${API_BASE}/call/${callSid}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) throw new Error(`Get Call Status Error: ${response.statusText}`);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to get call status: ${error.message}`);
    }
  }

  /**
   * Get call recordings
   */
  async getRecordings(callSid: string): Promise<Recording[]> {
    try {
      const response = await fetch(`${API_BASE}/recordings/${callSid}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) throw new Error(`Get Recordings Error: ${response.statusText}`);
      const data = await response.json();
      return data.recordings || [];
    } catch (error: any) {
      throw new Error(`Failed to get recordings: ${error.message}`);
    }
  }

  /**
   * Create phone extension
   */
  async createExtension(displayName: string, capabilities: string[] = []): Promise<PhoneExtension> {
    try {
      const response = await fetch(`${API_BASE}/extension`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName,
          capabilities,
        }),
      });

      if (!response.ok) throw new Error(`Create Extension Error: ${response.statusText}`);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to create extension: ${error.message}`);
    }
  }
}

// Singleton instance
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
