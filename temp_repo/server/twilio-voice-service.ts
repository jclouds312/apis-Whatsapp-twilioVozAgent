
import { logger } from './logger';

interface CallParams {
  from: string;
  to: string;
  extensionId?: string;
  record?: boolean;
}

interface CallRecord {
  callSid: string;
  from: string;
  to: string;
  status: string;
  direction: 'inbound' | 'outbound';
  duration?: number;
  recordingUrl?: string;
  startTime: Date;
  endTime?: Date;
  extensionId?: string;
}

export class TwilioVoiceService {
  private twilioClient: any;
  private config: {
    accountSid: string;
    authToken: string;
    apiKey: string;
    apiSecret: string;
    twimlAppSid: string;
    phoneNumber: string;
  };
  private activeCalls: Map<string, CallRecord> = new Map();

  constructor() {
    this.config = {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      apiKey: process.env.TWILIO_API_KEY || '',
      apiSecret: process.env.TWILIO_API_SECRET || '',
      twimlAppSid: process.env.TWILIO_TWIML_APP_SID || '',
      phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
    };

    if (this.isConfigured()) {
      const twilio = require('twilio');
      this.twilioClient = twilio(this.config.accountSid, this.config.authToken);
    }
  }

  isConfigured(): boolean {
    return !!(
      this.config.accountSid &&
      this.config.authToken &&
      this.config.phoneNumber
    );
  }

  generateAccessToken(identity: string, extensionNumber?: string): string {
    if (!this.config.apiKey || !this.config.apiSecret) {
      throw new Error('Twilio API credentials not configured');
    }

    const twilio = require('twilio');
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: this.config.twimlAppSid,
      incomingAllow: true,
    });

    const token = new AccessToken(
      this.config.accountSid,
      this.config.apiKey,
      this.config.apiSecret,
      {
        identity: identity || `ext_${extensionNumber || Date.now()}`,
        ttl: 3600,
      }
    );

    token.addGrant(voiceGrant);

    return token.toJwt();
  }

  async makeCall(params: CallParams): Promise<{ success: boolean; callSid?: string; error?: string }> {
    if (!this.isConfigured()) {
      return { success: false, error: 'Twilio Voice not configured' };
    }

    try {
      const callParams: any = {
        to: params.to,
        from: params.from || this.config.phoneNumber,
        url: `${process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 'http://0.0.0.0:5000'}/api/twilio/voice/twiml/outbound`,
        statusCallback: `${process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 'http://0.0.0.0:5000'}/api/twilio/voice/status`,
        statusCallbackMethod: 'POST',
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      };

      if (params.record) {
        callParams.record = true;
        callParams.recordingStatusCallback = `${process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 'http://0.0.0.0:5000'}/api/twilio/voice/recording`;
      }

      const call = await this.twilioClient.calls.create(callParams);

      const callRecord: CallRecord = {
        callSid: call.sid,
        from: params.from,
        to: params.to,
        status: call.status,
        direction: 'outbound',
        startTime: new Date(),
        extensionId: params.extensionId,
      };

      this.activeCalls.set(call.sid, callRecord);

      logger.info(`Outbound call initiated: ${call.sid}`, 'voice-service', {
        from: params.from,
        to: params.to,
      });

      return { success: true, callSid: call.sid };
    } catch (error: any) {
      logger.error('Error making call', 'voice-service', error);
      return { success: false, error: error.message };
    }
  }

  async getCallStatus(callSid: string): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('Twilio Voice not configured');
    }

    try {
      const call = await this.twilioClient.calls(callSid).fetch();
      return {
        sid: call.sid,
        status: call.status,
        duration: call.duration,
        direction: call.direction,
        from: call.from,
        to: call.to,
        startTime: call.startTime,
        endTime: call.endTime,
        price: call.price,
        priceUnit: call.priceUnit,
      };
    } catch (error: any) {
      logger.error('Error fetching call status', 'voice-service', error);
      throw error;
    }
  }

  async endCall(callSid: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isConfigured()) {
      return { success: false, error: 'Twilio Voice not configured' };
    }

    try {
      await this.twilioClient.calls(callSid).update({ status: 'completed' });
      
      const callRecord = this.activeCalls.get(callSid);
      if (callRecord) {
        callRecord.status = 'completed';
        callRecord.endTime = new Date();
      }

      logger.info(`Call ended: ${callSid}`, 'voice-service');
      return { success: true };
    } catch (error: any) {
      logger.error('Error ending call', 'voice-service', error);
      return { success: false, error: error.message };
    }
  }

  async getCallHistory(limit: number = 50): Promise<any[]> {
    if (!this.isConfigured()) {
      throw new Error('Twilio Voice not configured');
    }

    try {
      const calls = await this.twilioClient.calls.list({ limit });
      return calls.map((call: any) => ({
        sid: call.sid,
        from: call.from,
        to: call.to,
        status: call.status,
        duration: call.duration,
        direction: call.direction,
        startTime: call.startTime,
        endTime: call.endTime,
        price: call.price,
        priceUnit: call.priceUnit,
      }));
    } catch (error: any) {
      logger.error('Error fetching call history', 'voice-service', error);
      throw error;
    }
  }

  getActiveCalls(): CallRecord[] {
    return Array.from(this.activeCalls.values());
  }

  updateCallStatus(callSid: string, status: string, updates?: Partial<CallRecord>) {
    const call = this.activeCalls.get(callSid);
    if (call) {
      call.status = status;
      if (updates) {
        Object.assign(call, updates);
      }
      if (status === 'completed' && !call.endTime) {
        call.endTime = new Date();
      }
    }
  }

  generateTwiML(action: 'dial' | 'voicemail' | 'forward', params?: any): string {
    let twiml = '<?xml version="1.0" encoding="UTF-8"?><Response>';

    switch (action) {
      case 'dial':
        twiml += `<Dial callerId="${this.config.phoneNumber}">${params?.number || ''}</Dial>`;
        break;
      case 'voicemail':
        twiml += `<Say voice="alice">Please leave a message after the beep.</Say><Record maxLength="120" playBeep="true"/>`;
        break;
      case 'forward':
        twiml += `<Dial>${params?.forwardTo || ''}</Dial>`;
        break;
    }

    twiml += '</Response>';
    return twiml;
  }
}

export const twilioVoiceService = new TwilioVoiceService();
