
import { Router } from 'express';
import { voipExtensionService } from './services/VoIPExtensionService';
import { voipAuthMiddleware } from './middleware/voipAuth';
import { openSIPSTwilioIntegration } from './services/OpenSIPSTwilioIntegration';

export function registerVoIPExtensionRoutes(app: Router) {
  const router = Router();

  // Create extension
  router.post('/extensions/create', voipAuthMiddleware, async (req, res) => {
    try {
      const { userId, extensionNumber, displayName } = req.body;

      if (!userId || !extensionNumber || !displayName) {
        return res.status(400).json({
          success: false,
          error: 'userId, extensionNumber, and displayName are required',
        });
      }

      const extension = await voipExtensionService.createExtension(
        userId,
        extensionNumber,
        displayName
      );

      res.json({
        success: true,
        extension: {
          id: extension.id,
          extensionNumber: extension.extensionNumber,
          displayName: extension.displayName,
          sipCredentials: {
            username: extension.sipUsername,
            password: extension.sipPassword,
            domain: extension.sipDomain,
            sipUri: `sip:${extension.sipUsername}@${extension.sipDomain}`,
          },
          status: extension.status,
          forwardingEnabled: extension.forwardingEnabled,
          voicemailEnabled: extension.voicemailEnabled,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  // Get user extensions
  router.get('/extensions/user/:userId', voipAuthMiddleware, async (req, res) => {
    try {
      const { userId } = req.params;
      const extensions = voipExtensionService.getUserExtensions(userId);

      res.json({
        success: true,
        extensions: extensions.map(ext => ({
          id: ext.id,
          extensionNumber: ext.extensionNumber,
          displayName: ext.displayName,
          status: ext.status,
          forwardingEnabled: ext.forwardingEnabled,
          forwardingNumber: ext.forwardingNumber,
          voicemailEnabled: ext.voicemailEnabled,
          createdAt: ext.createdAt,
        })),
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  // Get extension details
  router.get('/extensions/:extensionId', voipAuthMiddleware, async (req, res) => {
    try {
      const { extensionId } = req.params;
      const extension = voipExtensionService.getExtension(extensionId);

      if (!extension) {
        return res.status(404).json({
          success: false,
          error: 'Extension not found',
        });
      }

      res.json({
        success: true,
        extension: {
          id: extension.id,
          extensionNumber: extension.extensionNumber,
          displayName: extension.displayName,
          sipCredentials: {
            username: extension.sipUsername,
            domain: extension.sipDomain,
            sipUri: `sip:${extension.sipUsername}@${extension.sipDomain}`,
          },
          status: extension.status,
          forwardingEnabled: extension.forwardingEnabled,
          forwardingNumber: extension.forwardingNumber,
          voicemailEnabled: extension.voicemailEnabled,
          createdAt: extension.createdAt,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  // Update extension
  router.put('/extensions/:extensionId', voipAuthMiddleware, async (req, res) => {
    try {
      const { extensionId } = req.params;
      const updates = req.body;

      const extension = await voipExtensionService.updateExtension(
        extensionId,
        updates
      );

      res.json({
        success: true,
        extension: {
          id: extension.id,
          extensionNumber: extension.extensionNumber,
          displayName: extension.displayName,
          status: extension.status,
          forwardingEnabled: extension.forwardingEnabled,
          forwardingNumber: extension.forwardingNumber,
          voicemailEnabled: extension.voicemailEnabled,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  // Delete extension
  router.delete('/extensions/:extensionId', voipAuthMiddleware, async (req, res) => {
    try {
      const { extensionId } = req.params;
      await voipExtensionService.deleteExtension(extensionId);

      res.json({
        success: true,
        message: 'Extension deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  // Make call from extension
  router.post('/extensions/:extensionId/call', voipAuthMiddleware, async (req, res) => {
    try {
      const { extensionId } = req.params;
      const { toNumber, useTwilio } = req.body;

      const extension = voipExtensionService.getExtension(extensionId);
      if (!extension) {
        return res.status(404).json({
          success: false,
          error: 'Extension not found',
        });
      }

      const fromNumber = `sip:${extension.sipUsername}@${extension.sipDomain}`;
      
      const callSession = await openSIPSTwilioIntegration.initiateCall(
        extension.userId,
        fromNumber,
        toNumber,
        useTwilio || false
      );

      res.json({
        success: true,
        call: callSession,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  // Create recurring call
  router.post('/extensions/:extensionId/recurring-calls', voipAuthMiddleware, async (req, res) => {
    try {
      const { extensionId } = req.params;
      const { destinationNumber, schedule } = req.body;

      if (!destinationNumber || !schedule) {
        return res.status(400).json({
          success: false,
          error: 'destinationNumber and schedule are required',
        });
      }

      const recurringCall = await voipExtensionService.createRecurringCall(
        extensionId,
        destinationNumber,
        schedule
      );

      res.json({
        success: true,
        recurringCall,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  // Get extension recurring calls
  router.get('/extensions/:extensionId/recurring-calls', voipAuthMiddleware, async (req, res) => {
    try {
      const { extensionId } = req.params;
      const recurringCalls = voipExtensionService.getExtensionRecurringCalls(extensionId);

      res.json({
        success: true,
        recurringCalls,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  // Update recurring call
  router.put('/recurring-calls/:recurringCallId', voipAuthMiddleware, async (req, res) => {
    try {
      const { recurringCallId } = req.params;
      const updates = req.body;

      const recurringCall = await voipExtensionService.updateRecurringCall(
        recurringCallId,
        updates
      );

      res.json({
        success: true,
        recurringCall,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  // Delete recurring call
  router.delete('/recurring-calls/:recurringCallId', voipAuthMiddleware, async (req, res) => {
    try {
      const { recurringCallId } = req.params;
      await voipExtensionService.deleteRecurringCall(recurringCallId);

      res.json({
        success: true,
        message: 'Recurring call deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  // Get all extensions (admin)
  router.get('/extensions', voipAuthMiddleware, async (req, res) => {
    try {
      const extensions = voipExtensionService.getAllExtensions();

      res.json({
        success: true,
        extensions: extensions.map(ext => ({
          id: ext.id,
          extensionNumber: ext.extensionNumber,
          displayName: ext.displayName,
          userId: ext.userId,
          status: ext.status,
          createdAt: ext.createdAt,
        })),
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  app.use('/api/v1/voip', router);
}
