
/**
 * OpenSIPS-Twilio Integration Service
 * Coordinates VoIP calls between OpenSIPS SIP server and Twilio API
 */

import { openSIPSService } from './OpenSIPSService';
import { voipService } from './VoIPService';
import { storage } from '../storage';

export interface CallSession {
  sessionId: string;
  twilioCallSid?: string;
  openSIPSCallId?: string;
  fromNumber: string;
  toNumber: string;
  status: 'initiating' | 'ringing' | 'active' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  sipCredentials?: {
    username: string;
    password: string;
    domain: string;
  };
}

export class OpenSIPSTwilioIntegration {
  private activeSessions: Map<string, CallSession> = new Map();

  /**
   * Initialize a call using OpenSIPS as SIP server
   */
  async initiateCall(
    userId: string,
    fromNumber: string,
    toNumber: string,
    useTwilio: boolean = false
  ): Promise<CallSession> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    // Generate SIP credentials via OpenSIPS
    const sipCreds = openSIPSService.generateSIPCredentials(userId);
    
    const session: CallSession = {
      sessionId,
      fromNumber,
      toNumber,
      status: 'initiating',
      startTime: new Date().toISOString(),
      sipCredentials: sipCreds,
    };

    // If using Twilio integration
    if (useTwilio) {
      try {
        const voipCall = await voipService.initiateCall(
          `opensips_${userId}`,
          fromNumber,
          toNumber,
          true
        );
        
        session.twilioCallSid = voipCall.callId;
      } catch (error: any) {
        console.error('Twilio call initiation failed:', error);
        session.status = 'failed';
      }
    }

    // Register call in OpenSIPS
    try {
      await openSIPSService.registerUser(
        sipCreds.username,
        sipCreds.password,
        sipCreds.domain
      );
      
      session.status = 'ringing';
    } catch (error: any) {
      console.error('OpenSIPS registration failed:', error);
      session.status = 'failed';
    }

    this.activeSessions.set(sessionId, session);

    // Log to database
    await storage.createSystemLog({
      userId,
      eventType: 'voip_call_initiated',
      service: 'opensips-twilio',
      message: `Call initiated: ${fromNumber} → ${toNumber}`,
      status: session.status === 'failed' ? 'error' : 'success',
      metadata: {
        sessionId,
        sipCredentials: {
          username: sipCreds.username,
          domain: sipCreds.domain,
        },
      },
    });

    return session;
  }

  /**
   * Get active call session
   */
  getSession(sessionId: string): CallSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  /**
   * Update call status
   */
  async updateCallStatus(
    sessionId: string,
    status: CallSession['status']
  ): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.status = status;
      
      if (status === 'completed' || status === 'failed') {
        session.endTime = new Date().toISOString();
      }
    }
  }

  /**
   * End call session
   */
  async endCall(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.status = 'completed';
    session.endTime = new Date().toISOString();

    await storage.createSystemLog({
      userId: 'system',
      eventType: 'voip_call_ended',
      service: 'opensips-twilio',
      message: `Call ended: ${session.sessionId}`,
      status: 'success',
      metadata: { sessionId, duration: this.getCallDuration(session) },
    });

    // Keep session for 5 minutes for reporting
    setTimeout(() => {
      this.activeSessions.delete(sessionId);
    }, 5 * 60 * 1000);
  }

  /**
   * Get call duration in seconds
   */
  private getCallDuration(session: CallSession): number {
    if (!session.endTime) return 0;
    
    const start = new Date(session.startTime).getTime();
    const end = new Date(session.endTime).getTime();
    
    return Math.floor((end - start) / 1000);
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): CallSession[] {
    return Array.from(this.activeSessions.values()).filter(
      s => s.status === 'ringing' || s.status === 'active'
    );
  }

  /**
   * Health check for OpenSIPS server
   */
  async healthCheck(): Promise<{
    opensipsStatus: string;
    activeCalls: number;
    serverUptime: boolean;
  }> {
    try {
      const status = await openSIPSService.getServerStatus();
      const activeCalls = this.getActiveSessions().length;
      
      return {
        opensipsStatus: status.status,
        activeCalls,
        serverUptime: status.status === 'running',
      };
    } catch (error) {
      return {
        opensipsStatus: 'error',
        activeCalls: 0,
        serverUptime: false,
      };
    }
  }
}

export const openSIPSTwilioIntegration = new OpenSIPSTwilioIntegration();
