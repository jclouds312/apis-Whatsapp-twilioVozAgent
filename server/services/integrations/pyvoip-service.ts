
import { spawn } from 'child_process';
import path from 'path';

export class PyVoIPService {
  private pythonProcess: any = null;
  private sipConfig: {
    username: string;
    password: string;
    server: string;
    port: number;
  };

  constructor() {
    this.sipConfig = {
      username: process.env.SIP_USERNAME || '',
      password: process.env.SIP_PASSWORD || '',
      server: process.env.SIP_SERVER || 'sip.example.com',
      port: parseInt(process.env.SIP_PORT || '5060')
    };
  }

  async initializeVoIPServer() {
    const scriptPath = path.join(__dirname, '../../../pyvoip-lib/pyVoIP/VoIP/VoIP.py');
    
    this.pythonProcess = spawn('python3', [scriptPath], {
      env: {
        ...process.env,
        SIP_USERNAME: this.sipConfig.username,
        SIP_PASSWORD: this.sipConfig.password,
        SIP_SERVER: this.sipConfig.server,
        SIP_PORT: this.sipConfig.port.toString()
      }
    });

    this.pythonProcess.stdout.on('data', (data: Buffer) => {
      console.log(`PyVoIP: ${data.toString()}`);
    });

    this.pythonProcess.stderr.on('data', (data: Buffer) => {
      console.error(`PyVoIP Error: ${data.toString()}`);
    });

    return { status: 'initialized', config: this.sipConfig };
  }

  async makeCall(toNumber: string, fromNumber: string) {
    // Implementar llamada usando PyVoIP
    return {
      callId: `pyvoip_${Date.now()}`,
      from: fromNumber,
      to: toNumber,
      status: 'initiated'
    };
  }

  async endCall(callId: string) {
    return { callId, status: 'ended' };
  }

  shutdown() {
    if (this.pythonProcess) {
      this.pythonProcess.kill();
    }
  }
}
