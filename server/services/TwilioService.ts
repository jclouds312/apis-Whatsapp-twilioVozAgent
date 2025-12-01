import twilio from "twilio";
import { storage } from "../storage";

const ADMIN_PHONE = "+18622770131"; // Admin phone number

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

export class TwilioService {
  private client: twilio.Twilio;
  private config: TwilioConfig;

  constructor(config: TwilioConfig) {
    this.config = config;
    this.client = twilio(config.accountSid, config.authToken);
  }

  async initiateCall(toNumber: string, userId: string, retellAgentId?: string) {
    try {
      const twimlUrl = `https://${process.env.REPLIT_DEV_DOMAIN || "localhost"}/api/twilio/twiml?agentId=${retellAgentId || "default"}`;

      const call = await this.client.calls.create({
        url: twimlUrl,
        to: toNumber,
        from: this.config.phoneNumber,
      });

      // Log to database
      await storage.createTwilioCall({
        userId,
        callSid: call.sid,
        fromNumber: this.config.phoneNumber,
        toNumber,
        status: "initiated",
        direction: "outbound",
      });

      // Log event
      await storage.createSystemLog({
        userId,
        eventType: "call_initiated",
        service: "twilio",
        message: `Call initiated to ${toNumber}`,
        status: "success",
        metadata: { callSid: call.sid, toNumber },
      });

      return call;
    } catch (error) {
      await storage.createSystemLog({
        userId,
        eventType: "call_failed",
        service: "twilio",
        message: `Failed to initiate call to ${toNumber}`,
        status: "error",
        metadata: { error: String(error), toNumber },
      });
      throw error;
    }
  }

  async sendSMS(toNumber: string, message: string, userId: string) {
    try {
      const sms = await this.client.messages.create({
        body: message,
        from: this.config.phoneNumber,
        to: toNumber,
      });

      await storage.createSystemLog({
        userId,
        eventType: "sms_sent",
        service: "twilio",
        message: `SMS sent to ${toNumber}`,
        status: "success",
        metadata: { messageSid: sms.sid, toNumber },
      });

      return sms;
    } catch (error) {
      throw error;
    }
  }

  async getCallStatus(callSid: string) {
    return await this.client.calls(callSid).fetch();
  }

  async recordCall(callSid: string) {
    return await this.client.calls(callSid).recordings.list();
  }

  async getPhoneNumbers() {
    return await this.client.incomingPhoneNumbers.list();
  }

  static getAdminPhone(): string {
    return ADMIN_PHONE;
  }

  static isAdminPhone(phone: string): boolean {
    return phone === ADMIN_PHONE || phone === ADMIN_PHONE.replace("+1", "+1 ");
  }
}

export const createTwilioService = (accountSid: string, authToken: string, phoneNumber: string) => {
  return new TwilioService({ accountSid, authToken, phoneNumber });
};
