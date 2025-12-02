/**
 * Twilio VoIP Service - Asterisk/Debian integration
 */

export interface PIKey {
  id: string;
  userId: string;
  piKey: string;
  sipCredentials: {
    username: string;
    password: string;
    sipServer: string;
    sipPort: number;
  };
  region: string;
  status: "active" | "inactive" | "expired";
  createdAt: string;
  expiresAt: string;
  callMinutes: number;
  costPerMinute: number;
}

export interface VoIPCall {
  id: string;
  callId: string;
  piKeyId: string;
  fromNumber: string;
  toNumber: string;
  status: "initiated" | "ringing" | "connected" | "completed" | "failed";
  duration: number;
  recordingUrl?: string;
  recordingDuration?: number;
  cost: number;
  startTime: string;
  endTime?: string;
}

export interface AsteriskConfig {
  hostname: string;
  port: number;
  username: string;
  password: string;
  context: string;
  allowedCountries: string[];
}

export class VoIPService {
  private asteriskConfig: AsteriskConfig;
  private useSIPServer: boolean;
  private openSIPSService: any;

  constructor(asteriskConfig?: AsteriskConfig, useSIPServer: boolean = true) {
    this.asteriskConfig = asteriskConfig || {
      hostname: "0.0.0.0",
      port: 5060,
      username: "admin",
      password: "admin",
      context: "from-internal",
      allowedCountries: ["US", "CA", "MX", "ES", "AR"],
    };
    this.useSIPServer = useSIPServer;
    
    // Import OpenSIPS service
    if (this.useSIPServer) {
      import('./OpenSIPSService').then(module => {
        this.openSIPSService = module.openSIPSService;
      });
    }
  }

  // ============= PI KEY MANAGEMENT =============
  async generatePIKey(userId: string, region: string = "US"): Promise<PIKey> {
    const piKey = `pi_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    let sipCredentials;
    
    // Use OpenSIPS server if enabled, otherwise use Asterisk
    if (this.useSIPServer && this.openSIPSService) {
      sipCredentials = this.openSIPSService.generateSIPCredentials(userId);
    } else {
      const sipUsername = `user_${Date.now()}`;
      const sipPassword = this.generateSecurePassword();
      sipCredentials = {
        username: sipUsername,
        password: sipPassword,
        sipServer: `sip.asterisk.${region.toLowerCase()}.voip.twilio.com`,
        sipPort: 5060,
      };
    }

    return {
      id: `pk_${Date.now()}`,
      userId,
      piKey,
      sipCredentials: {
        username: sipCredentials.username,
        password: sipCredentials.password,
        sipServer: sipCredentials.domain || sipCredentials.sipServer,
        sipPort: 5060,
      },
      region,
      status: "active",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      callMinutes: 0,
      costPerMinute: 0.015,
    };
  }

  async validatePIKey(piKey: string): Promise<boolean> {
    // In production, validate against database
    return piKey.startsWith("pi_");
  }

  // ============= VOICE CALLS =============
  async initiateCall(
    piKeyId: string,
    fromNumber: string,
    toNumber: string,
    recordingEnabled: boolean = true
  ): Promise<VoIPCall> {
    const callId = `call_${Date.now()}`;

    // In production, this would connect to Asterisk via AMI
    const call: VoIPCall = {
      id: `v_${Date.now()}`,
      callId,
      piKeyId,
      fromNumber,
      toNumber,
      status: "initiated",
      duration: 0,
      cost: 0,
      startTime: new Date().toISOString(),
    };

    // Simulate Asterisk call initiation
    if (recordingEnabled) {
      call.recordingUrl = `https://voip.twilio.com/recordings/${callId}.wav`;
    }

    return call;
  }

  async getCallStatus(callId: string): Promise<Partial<VoIPCall>> {
    // In production, query Asterisk for call status
    return {
      callId,
      status: "connected",
      duration: Math.floor(Math.random() * 3600),
    };
  }

  async endCall(callId: string, duration: number): Promise<VoIPCall> {
    return {
      id: callId,
      callId,
      piKeyId: "pk_test",
      fromNumber: "+1234567890",
      toNumber: "+0987654321",
      status: "completed",
      duration,
      cost: duration * 0.015,
      startTime: new Date(Date.now() - duration * 1000).toISOString(),
      endTime: new Date().toISOString(),
    };
  }

  // ============= RECORDINGS =============
  async getRecordings(piKeyId: string): Promise<any[]> {
    return [
      {
        id: "rec_1",
        callId: "call_123",
        duration: 300,
        fileSize: 2.4,
        url: "https://voip.twilio.com/recordings/rec_1.wav",
        createdAt: new Date().toISOString(),
      },
    ];
  }

  async deleteRecording(recordingId: string): Promise<boolean> {
    return true;
  }

  // ============= ASTERISK INTEGRATION =============
  async connectToAsterisk(): Promise<boolean> {
    try {
      // In production: connect via AMI protocol
      console.log(`Connecting to Asterisk at ${this.asteriskConfig.hostname}:${this.asteriskConfig.port}`);
      return true;
    } catch (error) {
      console.error("Asterisk connection failed:", error);
      return false;
    }
  }

  async getAsteriskStatus(): Promise<{
    connected: boolean;
    activeCalls: number;
    channels: number;
  }> {
    return {
      connected: true,
      activeCalls: Math.floor(Math.random() * 50),
      channels: Math.floor(Math.random() * 100),
    };
  }

  // ============= HELPERS =============
  private generateSecurePassword(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }

  calculateCallCost(durationSeconds: number, costPerMinute: number = 0.015): number {
    return (durationSeconds / 60) * costPerMinute;
  }
}

export const voipService = new VoIPService();
