
import { storage } from '../storage';
import { openSIPSService } from './OpenSIPSService';

export interface VoIPExtension {
  id: string;
  extensionNumber: string;
  userId: string;
  displayName: string;
  sipUsername: string;
  sipPassword: string;
  sipDomain: string;
  status: 'active' | 'inactive' | 'busy';
  forwardingEnabled: boolean;
  forwardingNumber?: string;
  voicemailEnabled: boolean;
  createdAt: string;
}

export interface RecurringCall {
  id: string;
  extensionId: string;
  destinationNumber: string;
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string; // HH:MM format
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    timezone: string;
  };
  enabled: boolean;
  lastExecuted?: string;
  nextExecution: string;
}

export class VoIPExtensionService {
  private extensions: Map<string, VoIPExtension> = new Map();
  private recurringCalls: Map<string, RecurringCall> = new Map();

  /**
   * Create a new VoIP extension
   */
  async createExtension(
    userId: string,
    extensionNumber: string,
    displayName: string
  ): Promise<VoIPExtension> {
    // Generate SIP credentials
    const sipCreds = openSIPSService.generateSIPCredentials(userId);
    
    const extension: VoIPExtension = {
      id: `ext_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      extensionNumber,
      userId,
      displayName,
      sipUsername: sipCreds.username,
      sipPassword: sipCreds.password,
      sipDomain: sipCreds.domain,
      status: 'inactive',
      forwardingEnabled: false,
      voicemailEnabled: true,
      createdAt: new Date().toISOString(),
    };

    // Register extension in OpenSIPS
    try {
      await openSIPSService.registerUser(
        sipCreds.username,
        sipCreds.password,
        sipCreds.domain
      );

      extension.status = 'active';
    } catch (error: any) {
      console.error('Failed to register extension in OpenSIPS:', error);
      throw new Error(`Failed to create extension: ${error.message}`);
    }

    this.extensions.set(extension.id, extension);

    // Log to database
    await storage.createSystemLog({
      userId,
      eventType: 'voip_extension_created',
      service: 'voip-extensions',
      message: `Extension ${extensionNumber} created for ${displayName}`,
      status: 'success',
      metadata: {
        extensionId: extension.id,
        extensionNumber,
        sipUsername: sipCreds.username,
      },
    });

    return extension;
  }

  /**
   * Get extension by ID
   */
  getExtension(extensionId: string): VoIPExtension | undefined {
    return this.extensions.get(extensionId);
  }

  /**
   * Get all extensions for a user
   */
  getUserExtensions(userId: string): VoIPExtension[] {
    return Array.from(this.extensions.values()).filter(
      ext => ext.userId === userId
    );
  }

  /**
   * Update extension settings
   */
  async updateExtension(
    extensionId: string,
    updates: Partial<VoIPExtension>
  ): Promise<VoIPExtension> {
    const extension = this.extensions.get(extensionId);
    if (!extension) {
      throw new Error('Extension not found');
    }

    // Update allowed fields
    if (updates.displayName) extension.displayName = updates.displayName;
    if (updates.forwardingEnabled !== undefined) {
      extension.forwardingEnabled = updates.forwardingEnabled;
    }
    if (updates.forwardingNumber) {
      extension.forwardingNumber = updates.forwardingNumber;
    }
    if (updates.voicemailEnabled !== undefined) {
      extension.voicemailEnabled = updates.voicemailEnabled;
    }
    if (updates.status) extension.status = updates.status;

    await storage.createSystemLog({
      userId: extension.userId,
      eventType: 'voip_extension_updated',
      service: 'voip-extensions',
      message: `Extension ${extension.extensionNumber} updated`,
      status: 'success',
      metadata: { extensionId, updates },
    });

    return extension;
  }

  /**
   * Delete extension
   */
  async deleteExtension(extensionId: string): Promise<void> {
    const extension = this.extensions.get(extensionId);
    if (!extension) {
      throw new Error('Extension not found');
    }

    this.extensions.delete(extensionId);

    await storage.createSystemLog({
      userId: extension.userId,
      eventType: 'voip_extension_deleted',
      service: 'voip-extensions',
      message: `Extension ${extension.extensionNumber} deleted`,
      status: 'success',
      metadata: { extensionId },
    });
  }

  /**
   * Create recurring call schedule
   */
  async createRecurringCall(
    extensionId: string,
    destinationNumber: string,
    schedule: RecurringCall['schedule']
  ): Promise<RecurringCall> {
    const extension = this.extensions.get(extensionId);
    if (!extension) {
      throw new Error('Extension not found');
    }

    const recurringCall: RecurringCall = {
      id: `rc_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      extensionId,
      destinationNumber,
      schedule,
      enabled: true,
      nextExecution: this.calculateNextExecution(schedule),
    };

    this.recurringCalls.set(recurringCall.id, recurringCall);

    await storage.createSystemLog({
      userId: extension.userId,
      eventType: 'recurring_call_created',
      service: 'voip-extensions',
      message: `Recurring call created from ${extension.extensionNumber} to ${destinationNumber}`,
      status: 'success',
      metadata: { recurringCallId: recurringCall.id, schedule },
    });

    return recurringCall;
  }

  /**
   * Get recurring calls for extension
   */
  getExtensionRecurringCalls(extensionId: string): RecurringCall[] {
    return Array.from(this.recurringCalls.values()).filter(
      rc => rc.extensionId === extensionId
    );
  }

  /**
   * Update recurring call
   */
  async updateRecurringCall(
    recurringCallId: string,
    updates: Partial<RecurringCall>
  ): Promise<RecurringCall> {
    const recurringCall = this.recurringCalls.get(recurringCallId);
    if (!recurringCall) {
      throw new Error('Recurring call not found');
    }

    if (updates.enabled !== undefined) recurringCall.enabled = updates.enabled;
    if (updates.destinationNumber) {
      recurringCall.destinationNumber = updates.destinationNumber;
    }
    if (updates.schedule) {
      recurringCall.schedule = updates.schedule;
      recurringCall.nextExecution = this.calculateNextExecution(updates.schedule);
    }

    const extension = this.extensions.get(recurringCall.extensionId);
    if (extension) {
      await storage.createSystemLog({
        userId: extension.userId,
        eventType: 'recurring_call_updated',
        service: 'voip-extensions',
        message: `Recurring call ${recurringCallId} updated`,
        status: 'success',
        metadata: { recurringCallId, updates },
      });
    }

    return recurringCall;
  }

  /**
   * Delete recurring call
   */
  async deleteRecurringCall(recurringCallId: string): Promise<void> {
    const recurringCall = this.recurringCalls.get(recurringCallId);
    if (!recurringCall) {
      throw new Error('Recurring call not found');
    }

    this.recurringCalls.delete(recurringCallId);

    const extension = this.extensions.get(recurringCall.extensionId);
    if (extension) {
      await storage.createSystemLog({
        userId: extension.userId,
        eventType: 'recurring_call_deleted',
        service: 'voip-extensions',
        message: `Recurring call ${recurringCallId} deleted`,
        status: 'success',
        metadata: { recurringCallId },
      });
    }
  }

  /**
   * Calculate next execution time for recurring call
   */
  private calculateNextExecution(schedule: RecurringCall['schedule']): string {
    const now = new Date();
    const [hours, minutes] = schedule.time.split(':').map(Number);
    
    let nextExec = new Date(now);
    nextExec.setHours(hours, minutes, 0, 0);

    // If time has passed today, move to next occurrence
    if (nextExec <= now) {
      switch (schedule.frequency) {
        case 'daily':
          nextExec.setDate(nextExec.getDate() + 1);
          break;
        case 'weekly':
          const daysUntilNext = ((schedule.dayOfWeek || 0) - nextExec.getDay() + 7) % 7 || 7;
          nextExec.setDate(nextExec.getDate() + daysUntilNext);
          break;
        case 'monthly':
          nextExec.setMonth(nextExec.getMonth() + 1);
          nextExec.setDate(schedule.dayOfMonth || 1);
          break;
      }
    }

    return nextExec.toISOString();
  }

  /**
   * Execute pending recurring calls
   */
  async processPendingRecurringCalls(): Promise<void> {
    const now = new Date();

    for (const [id, recurringCall] of this.recurringCalls.entries()) {
      if (!recurringCall.enabled) continue;

      const nextExec = new Date(recurringCall.nextExecution);
      if (nextExec <= now) {
        const extension = this.extensions.get(recurringCall.extensionId);
        if (extension) {
          try {
            // Trigger call execution (integrate with OpenSIPSTwilioIntegration)
            console.log(`Executing recurring call ${id}: ${extension.extensionNumber} -> ${recurringCall.destinationNumber}`);
            
            recurringCall.lastExecuted = now.toISOString();
            recurringCall.nextExecution = this.calculateNextExecution(recurringCall.schedule);

            await storage.createSystemLog({
              userId: extension.userId,
              eventType: 'recurring_call_executed',
              service: 'voip-extensions',
              message: `Recurring call executed: ${extension.extensionNumber} -> ${recurringCall.destinationNumber}`,
              status: 'success',
              metadata: { recurringCallId: id },
            });
          } catch (error: any) {
            console.error(`Failed to execute recurring call ${id}:`, error);
          }
        }
      }
    }
  }

  /**
   * Get all extensions
   */
  getAllExtensions(): VoIPExtension[] {
    return Array.from(this.extensions.values());
  }

  /**
   * Get all recurring calls
   */
  getAllRecurringCalls(): RecurringCall[] {
    return Array.from(this.recurringCalls.values());
  }
}

export const voipExtensionService = new VoIPExtensionService();
