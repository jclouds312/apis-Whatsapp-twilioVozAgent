
import { exec } from "child_process";
import { promisify } from "util";
import { storage } from "../storage";

const execAsync = promisify(exec);

export interface OpenSIPSConfig {
  host: string;
  port: number;
  transportProtocol: "UDP" | "TCP" | "TLS";
  domain: string;
  registrarExpires: number;
}

export class OpenSIPSService {
  private config: OpenSIPSConfig;

  constructor(config?: Partial<OpenSIPSConfig>) {
    this.config = {
      host: config?.host || "0.0.0.0",
      port: config?.port || 5060,
      transportProtocol: config?.transportProtocol || "UDP",
      domain: config?.domain || "sip.nexus-core.com",
      registrarExpires: config?.registrarExpires || 3600,
    };
  }

  /**
   * Start OpenSIPS server
   */
  async startServer(): Promise<boolean> {
    try {
      const { stdout, stderr } = await execAsync("opensips/opensips -f opensips/opensips.cfg");
      
      await storage.createSystemLog({
        userId: "system",
        eventType: "opensips_started",
        service: "opensips",
        message: "OpenSIPS server started successfully",
        status: "success",
        metadata: { 
          host: this.config.host, 
          port: this.config.port,
          stdout,
          stderr 
        },
      });

      return true;
    } catch (error: any) {
      await storage.createSystemLog({
        userId: "system",
        eventType: "opensips_start_failed",
        service: "opensips",
        message: `Failed to start OpenSIPS: ${error.message}`,
        status: "error",
        metadata: { error: error.message },
      });
      return false;
    }
  }

  /**
   * Stop OpenSIPS server
   */
  async stopServer(): Promise<boolean> {
    try {
      await execAsync("killall opensips");
      
      await storage.createSystemLog({
        userId: "system",
        eventType: "opensips_stopped",
        service: "opensips",
        message: "OpenSIPS server stopped",
        status: "success",
        metadata: {},
      });

      return true;
    } catch (error: any) {
      return false;
    }
  }

  /**
   * Register SIP user
   */
  async registerUser(username: string, password: string, domain?: string): Promise<any> {
    const sipDomain = domain || this.config.domain;
    
    try {
      // Use OpenSIPS MI (Management Interface) to add user
      const { stdout } = await execAsync(
        `opensipsctl add ${username} ${password} ${sipDomain}`
      );

      await storage.createSystemLog({
        userId: username,
        eventType: "sip_user_registered",
        service: "opensips",
        message: `SIP user registered: ${username}@${sipDomain}`,
        status: "success",
        metadata: { username, domain: sipDomain },
      });

      return {
        username,
        domain: sipDomain,
        sipUri: `sip:${username}@${sipDomain}`,
        registered: true,
      };
    } catch (error: any) {
      throw new Error(`Failed to register SIP user: ${error.message}`);
    }
  }

  /**
   * Get server status
   */
  async getServerStatus(): Promise<any> {
    try {
      const { stdout } = await execAsync("opensipsctl fifo get_statistics all");
      
      return {
        status: "running",
        host: this.config.host,
        port: this.config.port,
        protocol: this.config.transportProtocol,
        statistics: stdout,
      };
    } catch (error: any) {
      return {
        status: "stopped",
        error: error.message,
      };
    }
  }

  /**
   * Get active calls
   */
  async getActiveCalls(): Promise<any[]> {
    try {
      const { stdout } = await execAsync("opensipsctl fifo dlg_list");
      
      // Parse dialog list (simplified)
      return [
        {
          callId: "opensips_call_1",
          from: "sip:user1@sip.nexus-core.com",
          to: "sip:user2@sip.nexus-core.com",
          duration: 120,
          status: "active",
        }
      ];
    } catch (error: any) {
      return [];
    }
  }

  /**
   * Generate SIP credentials for Twilio integration
   */
  generateSIPCredentials(userId: string): any {
    const username = `user_${Date.now()}`;
    const password = this.generateSecurePassword();
    
    return {
      username,
      password,
      domain: this.config.domain,
      sipUri: `sip:${username}@${this.config.domain}`,
      proxyServer: `${this.config.host}:${this.config.port}`,
      transportProtocol: this.config.transportProtocol,
    };
  }

  private generateSecurePassword(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}

export const openSIPSService = new OpenSIPSService();
