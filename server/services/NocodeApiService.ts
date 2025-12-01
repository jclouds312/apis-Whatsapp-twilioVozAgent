import axios, { AxiosInstance } from "axios";

const NOCODE_API_BASE = "https://v1.nocodeapi.com/john474n/twilio/jbngLoZWwbtslepf";

export class NocodeApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: NOCODE_API_BASE,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async sendSMS(to: string, body: string, from: string = "+18622770131") {
    try {
      const response = await this.client.post("/sendSMS", {
        to,
        body,
        from,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async makeCall(to: string, from: string = "+18622770131", recordCall: boolean = true) {
    try {
      const response = await this.client.post("/makeCall", {
        to,
        from,
        recordCall,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCallStatus(callSid: string) {
    try {
      const response = await this.client.post("/getCallStatus", {
        callSid,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getRecordings(callSid: string) {
    try {
      const response = await this.client.post("/getRecordings", {
        callSid,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async buyPhoneNumber(areaCode: string = "201") {
    try {
      const response = await this.client.post("/buyPhoneNumber", {
        areaCode,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async sendVoiceMessage(to: string, message: string, voice: string = "Alice", from: string = "+18622770131") {
    try {
      // Send voice via call with TwiML
      const response = await this.client.post("/makeCall", {
        to,
        from,
        twiml: `<Response><Say voice="${voice}">${message}</Say></Response>`,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const nocodeApiService = new NocodeApiService();
