
import { spawn } from 'child_process';
import path from 'path';

export class DoorPiService {
  private doorpiProcess: any = null;

  async initializeDoorPi(config: {
    gpioPin?: number;
    rfidEnabled?: boolean;
    sipAccount?: string;
  }) {
    const configPath = path.join(__dirname, '../../../doorpi-lib/doorpi/conf/config_object.py');
    
    this.doorpiProcess = spawn('python3', ['-m', 'doorpi.main'], {
      cwd: path.join(__dirname, '../../../doorpi-lib'),
      env: {
        ...process.env,
        DOORPI_GPIO_PIN: config.gpioPin?.toString() || '17',
        DOORPI_RFID_ENABLED: config.rfidEnabled ? '1' : '0',
        DOORPI_SIP_ACCOUNT: config.sipAccount || ''
      }
    });

    this.doorpiProcess.stdout.on('data', (data: Buffer) => {
      console.log(`DoorPi: ${data.toString()}`);
    });

    return { status: 'initialized', config };
  }

  async triggerDoorOpen() {
    // Simular apertura de puerta
    return { status: 'door_opened', timestamp: new Date() };
  }

  async readRFID() {
    // Simular lectura RFID
    return { rfidTag: `RFID_${Date.now()}`, authorized: true };
  }

  shutdown() {
    if (this.doorpiProcess) {
      this.doorpiProcess.kill();
    }
  }
}
