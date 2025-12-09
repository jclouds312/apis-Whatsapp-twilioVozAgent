
import axios from 'axios';
import { logger } from './logger';

interface OTPConfig {
  phoneNumberId: string;
  accessToken: string;
  apiVersion: string;
}

interface OTPSession {
  phoneNumber: string;
  otp: string;
  expiresAt: Date;
  verified: boolean;
}

class WhatsAppOTPService {
  private config: OTPConfig;
  private sessions: Map<string, OTPSession> = new Map();
  private baseUrl: string;

  constructor() {
    this.config = {
      phoneNumberId: process.env.WA_PHONE_NUMBER_ID || '',
      accessToken: process.env.WA_ACCESS_TOKEN || '',
      apiVersion: process.env.WA_API_VERSION || 'v18.0',
    };
    this.baseUrl = `https://graph.facebook.com/${this.config.apiVersion}/${this.config.phoneNumberId}/messages`;
  }

  isConfigured(): boolean {
    return !!(this.config.phoneNumberId && this.config.accessToken);
  }

  private generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }

  private cleanPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    return phone.replace(/\D/g, '');
  }

  async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string; sessionId?: string }> {
    try {
      if (!this.isConfigured()) {
        throw new Error('WhatsApp OTP service is not configured');
      }

      const cleanPhone = this.cleanPhoneNumber(phoneNumber);
      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Store OTP session
      const sessionId = `${cleanPhone}_${Date.now()}`;
      this.sessions.set(sessionId, {
        phoneNumber: cleanPhone,
        otp,
        expiresAt,
        verified: false,
      });

      // Clean up expired sessions
      this.cleanupExpiredSessions();

      // Send OTP via WhatsApp
      const message = `Your verification code is: ${otp}\n\nThis code will expire in 5 minutes.\n\nDo not share this code with anyone.`;

      const response = await axios.post(
        this.baseUrl,
        {
          messaging_product: 'whatsapp',
          to: cleanPhone,
          type: 'text',
          text: {
            body: message,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info(`OTP sent to ${cleanPhone}`, { sessionId });

      return {
        success: true,
        message: 'OTP sent successfully',
        sessionId,
      };
    } catch (error: any) {
      logger.error('Error sending OTP:', error);
      return {
        success: false,
        message: error.response?.data?.error?.message || error.message,
      };
    }
  }

  async verifyOTP(sessionId: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      const session = this.sessions.get(sessionId);

      if (!session) {
        return {
          success: false,
          message: 'Invalid session',
        };
      }

      if (session.verified) {
        return {
          success: false,
          message: 'OTP already verified',
        };
      }

      if (new Date() > session.expiresAt) {
        this.sessions.delete(sessionId);
        return {
          success: false,
          message: 'OTP expired',
        };
      }

      if (session.otp !== otp) {
        return {
          success: false,
          message: 'Invalid OTP',
        };
      }

      // Mark as verified
      session.verified = true;
      this.sessions.set(sessionId, session);

      logger.info(`OTP verified for session ${sessionId}`);

      return {
        success: true,
        message: 'OTP verified successfully',
      };
    } catch (error: any) {
      logger.error('Error verifying OTP:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async resendOTP(sessionId: string): Promise<{ success: boolean; message: string; newSessionId?: string }> {
    try {
      const session = this.sessions.get(sessionId);

      if (!session) {
        return {
          success: false,
          message: 'Invalid session',
        };
      }

      // Delete old session
      this.sessions.delete(sessionId);

      // Send new OTP
      return await this.sendOTP(session.phoneNumber);
    } catch (error: any) {
      logger.error('Error resending OTP:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  private cleanupExpiredSessions(): void {
    const now = new Date();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(sessionId);
        logger.info(`Cleaned up expired session ${sessionId}`);
      }
    }
  }

  getSessionStatus(sessionId: string): { exists: boolean; verified?: boolean; expired?: boolean } {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return { exists: false };
    }

    const expired = new Date() > session.expiresAt;
    
    return {
      exists: true,
      verified: session.verified,
      expired,
    };
  }
}

export const whatsAppOTPService = new WhatsAppOTPService();
