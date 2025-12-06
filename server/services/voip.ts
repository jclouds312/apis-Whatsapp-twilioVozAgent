
import twilio from 'twilio';

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

export class VoIPService {
  private client: twilio.Twilio;
  private accountSid: string;
  private authToken: string;
  private apiKey: string;
  private apiSecret: string;
  private appSid: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.apiKey = process.env.TWILIO_API_KEY || '';
    this.apiSecret = process.env.TWILIO_API_SECRET || '';
    this.appSid = process.env.TWILIO_APP_SID || '';
    this.client = twilio(this.accountSid, this.authToken);
  }

  async generateVoiceToken(identity: string): Promise<string> {
    const token = new AccessToken(
      this.accountSid,
      this.apiKey,
      this.apiSecret,
      { identity }
    );

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: this.appSid,
      incomingAllow: true,
    });

    token.addGrant(voiceGrant);
    return token.toJwt();
  }

  async initiateCall(to: string, from: string, identity: string) {
    try {
      const call = await this.client.calls.create({
        to,
        from,
        url: `${process.env.BASE_URL}/api/voip/calls/incoming`,
        statusCallback: `${process.env.BASE_URL}/api/voip/calls/status`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        record: true,
      });
      return call;
    } catch (error) {
      throw new Error(`Failed to initiate call: ${(error as Error).message}`);
    }
  }

  async handleIncomingCall(params: any): Promise<string> {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();
    
    response.say({ voice: 'alice' }, 'Bienvenido al sistema de voz. Por favor espere.');
    response.dial({
      callerId: params.From,
      record: 'record-from-answer',
    }, params.To);

    return response.toString();
  }

  async getCallStatus(callSid: string) {
    try {
      const call = await this.client.calls(callSid).fetch();
      return {
        sid: call.sid,
        status: call.status,
        duration: call.duration,
        from: call.from,
        to: call.to,
        price: call.price,
        direction: call.direction,
      };
    } catch (error) {
      throw new Error(`Failed to get call status: ${(error as Error).message}`);
    }
  }

  async endCall(callSid: string) {
    try {
      await this.client.calls(callSid).update({ status: 'completed' });
    } catch (error) {
      throw new Error(`Failed to end call: ${(error as Error).message}`);
    }
  }

  async recordCall(callSid: string) {
    try {
      const recording = await this.client.calls(callSid).recordings.create();
      return recording;
    } catch (error) {
      throw new Error(`Failed to record call: ${(error as Error).message}`);
    }
  }

  async listRecordings(callSid: string) {
    try {
      const recordings = await this.client.recordings.list({ callSid });
      return recordings;
    } catch (error) {
      throw new Error(`Failed to list recordings: ${(error as Error).message}`);
    }
  }
}
