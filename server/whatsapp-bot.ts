
import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode';
import { EventEmitter } from 'events';

class WhatsAppBotService extends EventEmitter {
  private client: Client | null = null;
  private qrCode: string = '';
  private isReady: boolean = false;
  private connectionStatus: string = 'disconnected';

  constructor() {
    super();
  }

  async initialize() {
    if (this.client) {
      return;
    }

    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: '.wwebjs_auth'
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      }
    });

    this.client.on('qr', async (qr) => {
      console.log('QR Code received');
      this.qrCode = await qrcode.toDataURL(qr);
      this.connectionStatus = 'qr_ready';
      this.emit('qr', this.qrCode);
    });

    this.client.on('ready', () => {
      console.log('WhatsApp Bot is ready!');
      this.isReady = true;
      this.connectionStatus = 'connected';
      this.emit('ready');
    });

    this.client.on('authenticated', () => {
      console.log('WhatsApp Bot authenticated');
      this.connectionStatus = 'authenticated';
      this.emit('authenticated');
    });

    this.client.on('auth_failure', (msg) => {
      console.error('WhatsApp authentication failed:', msg);
      this.connectionStatus = 'auth_failed';
      this.emit('auth_failure', msg);
    });

    this.client.on('disconnected', (reason) => {
      console.log('WhatsApp Bot disconnected:', reason);
      this.isReady = false;
      this.connectionStatus = 'disconnected';
      this.emit('disconnected', reason);
    });

    this.client.on('message', async (message) => {
      this.emit('message', {
        from: message.from,
        body: message.body,
        timestamp: message.timestamp,
        hasMedia: message.hasMedia
      });
    });

    await this.client.initialize();
  }

  async sendMessage(to: string, message: string) {
    if (!this.client || !this.isReady) {
      throw new Error('WhatsApp client is not ready');
    }

    const chatId = to.includes('@c.us') ? to : `${to}@c.us`;
    await this.client.sendMessage(chatId, message);
  }

  async getChats() {
    if (!this.client || !this.isReady) {
      return [];
    }

    const chats = await this.client.getChats();
    return chats.map(chat => ({
      id: chat.id._serialized,
      name: chat.name,
      isGroup: chat.isGroup,
      unreadCount: chat.unreadCount,
      lastMessage: chat.lastMessage?.body || ''
    }));
  }

  getQRCode() {
    return this.qrCode;
  }

  getStatus() {
    return {
      isReady: this.isReady,
      status: this.connectionStatus
    };
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy();
      this.client = null;
      this.isReady = false;
      this.connectionStatus = 'disconnected';
    }
  }
}

export const whatsAppBot = new WhatsAppBotService();
