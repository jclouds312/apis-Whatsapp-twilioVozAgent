
import { logger } from './logger';

interface VoiceNotificationConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

interface NotificationOptions {
  to: string;
  message: string;
  voiceId?: string;
  language?: string;
  repeat?: number;
}

export class TwilioVoiceNotifications {
  private config: VoiceNotificationConfig;
  private twilioClient: any;

  constructor() {
    this.config = {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      fromNumber: process.env.TWILIO_PHONE_NUMBER || '',
    };

    if (this.isConfigured()) {
      const twilio = require('twilio');
      this.twilioClient = twilio(this.config.accountSid, this.config.authToken);
    }
  }

  isConfigured(): boolean {
    return !!(this.config.accountSid && this.config.authToken && this.config.fromNumber);
  }

  async sendVoiceNotification(options: NotificationOptions) {
    if (!this.isConfigured()) {
      throw new Error('Twilio Voice Notifications not configured');
    }

    try {
      const twimlUrl = await this.generateTwiMLUrl(options.message, options.voiceId, options.language, options.repeat);

      const call = await this.twilioClient.calls.create({
        to: options.to,
        from: this.config.fromNumber,
        url: twimlUrl,
        method: 'GET',
      });

      logger.info(`Voice notification sent to ${options.to}`, 'voice-notifications', { callSid: call.sid });

      return {
        success: true,
        callSid: call.sid,
        status: call.status,
      };
    } catch (error: any) {
      logger.error('Error sending voice notification', 'voice-notifications', error);
      throw error;
    }
  }

  private async generateTwiMLUrl(message: string, voiceId?: string, language?: string, repeat?: number): Promise<string> {
    // Generate TwiML dynamically or use a hosted TwiML endpoint
    // For now, we'll use Twilio's TwiML bins or return a data URL
    const voice = voiceId || 'alice';
    const lang = language || 'en-US';
    const repeatCount = repeat || 1;

    let twiml = '<?xml version="1.0" encoding="UTF-8"?><Response>';
    
    for (let i = 0; i < repeatCount; i++) {
      twiml += `<Say voice="${voice}" language="${lang}">${this.escapeXml(message)}</Say>`;
      if (i < repeatCount - 1) {
        twiml += '<Pause length="1"/>';
      }
    }
    
    twiml += '</Response>';

    // Store TwiML in a temporary endpoint or return as base64 data URL
    return `data:application/xml;base64,${Buffer.from(twiml).toString('base64')}`;
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  async sendBulkNotifications(recipients: string[], message: string, options?: Partial<NotificationOptions>) {
    const results = [];

    for (const recipient of recipients) {
      try {
        const result = await this.sendVoiceNotification({
          to: recipient,
          message,
          ...options,
        });
        results.push({ recipient, success: true, ...result });
      } catch (error: any) {
        results.push({ recipient, success: false, error: error.message });
      }
    }

    return results;
  }

  async getCallStatus(callSid: string) {
    if (!this.isConfigured()) {
      throw new Error('Twilio Voice Notifications not configured');
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
      };
    } catch (error: any) {
      logger.error('Error fetching call status', 'voice-notifications', error);
      throw error;
    }
  }

  async cancelCall(callSid: string) {
    if (!this.isConfigured()) {
      throw new Error('Twilio Voice Notifications not configured');
    }

    try {
      const call = await this.twilioClient.calls(callSid).update({ status: 'canceled' });
      return {
        success: true,
        sid: call.sid,
        status: call.status,
      };
    } catch (error: any) {
      logger.error('Error canceling call', 'voice-notifications', error);
      throw error;
    }
  }
}

export const twilioVoiceNotifications = new TwilioVoiceNotifications();
