
import { Device } from '@twilio/voice-sdk';

interface TwilioVoiceConfig {
  token: string;
  edge?: string;
}

interface CallOptions {
  To: string;
  From?: string;
}

export class TwilioVoiceService {
  private device: Device | null = null;
  private currentCall: any = null;
  private eventCallbacks: { [key: string]: Function[] } = {};

  async initialize(config: TwilioVoiceConfig) {
    try {
      this.device = new Device(config.token, {
        edge: config.edge || 'ashburn',
        codecPreferences: ['opus', 'pcmu'],
        enableRingingState: true,
      });

      this.setupDeviceListeners();
      await this.device.register();
      
      return { success: true, message: 'Device registered successfully' };
    } catch (error: any) {
      console.error('Failed to initialize Twilio Voice:', error);
      return { success: false, message: error.message };
    }
  }

  private setupDeviceListeners() {
    if (!this.device) return;

    this.device.on('registered', () => {
      this.emit('registered');
    });

    this.device.on('error', (error) => {
      console.error('Device error:', error);
      this.emit('error', error);
    });

    this.device.on('incoming', (call) => {
      this.currentCall = call;
      this.setupCallListeners(call);
      this.emit('incoming', {
        from: call.parameters.From,
        callSid: call.parameters.CallSid,
      });
    });

    this.device.on('tokenWillExpire', () => {
      this.emit('tokenWillExpire');
    });
  }

  private setupCallListeners(call: any) {
    call.on('accept', () => {
      this.emit('callAccepted', call);
    });

    call.on('disconnect', () => {
      this.currentCall = null;
      this.emit('callDisconnected', call);
    });

    call.on('cancel', () => {
      this.currentCall = null;
      this.emit('callCanceled', call);
    });

    call.on('reject', () => {
      this.currentCall = null;
      this.emit('callRejected', call);
    });

    call.on('error', (error) => {
      console.error('Call error:', error);
      this.emit('callError', error);
    });

    call.on('mute', (isMuted: boolean) => {
      this.emit('callMuted', isMuted);
    });

    call.on('volume', (inputVolume: number, outputVolume: number) => {
      this.emit('callVolume', { inputVolume, outputVolume });
    });
  }

  async makeCall(options: CallOptions) {
    if (!this.device) {
      throw new Error('Device not initialized');
    }

    try {
      const call = await this.device.connect({ params: options });
      this.currentCall = call;
      this.setupCallListeners(call);
      
      return {
        success: true,
        callSid: call.parameters.CallSid,
      };
    } catch (error: any) {
      console.error('Failed to make call:', error);
      return { success: false, message: error.message };
    }
  }

  acceptIncomingCall() {
    if (this.currentCall) {
      this.currentCall.accept();
    }
  }

  rejectIncomingCall() {
    if (this.currentCall) {
      this.currentCall.reject();
    }
  }

  hangup() {
    if (this.currentCall) {
      this.currentCall.disconnect();
    }
  }

  mute(shouldMute: boolean) {
    if (this.currentCall) {
      this.currentCall.mute(shouldMute);
    }
  }

  sendDigits(digits: string) {
    if (this.currentCall) {
      this.currentCall.sendDigits(digits);
    }
  }

  getCallStatus() {
    if (!this.currentCall) {
      return { status: 'idle' };
    }

    return {
      status: this.currentCall.status(),
      isMuted: this.currentCall.isMuted(),
      direction: this.currentCall.direction,
    };
  }

  on(event: string, callback: Function) {
    if (!this.eventCallbacks[event]) {
      this.eventCallbacks[event] = [];
    }
    this.eventCallbacks[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (this.eventCallbacks[event]) {
      this.eventCallbacks[event] = this.eventCallbacks[event].filter(
        (cb) => cb !== callback
      );
    }
  }

  private emit(event: string, data?: any) {
    if (this.eventCallbacks[event]) {
      this.eventCallbacks[event].forEach((callback) => callback(data));
    }
  }

  async destroy() {
    if (this.device) {
      this.device.disconnectAll();
      this.device.unregister();
      this.device.destroy();
      this.device = null;
    }
  }

  getDevice() {
    return this.device;
  }
}

export const twilioVoiceService = new TwilioVoiceService();
