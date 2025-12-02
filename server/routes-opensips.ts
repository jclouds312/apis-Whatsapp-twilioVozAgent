import { Router } from 'express';
import { openSIPSService } from './services/OpenSIPSService';
import { voipAuthMiddleware } from './middleware/voipAuth';
import { openSIPSTwilioIntegration } from './services/OpenSIPSTwilioIntegration';

export function registerOpenSIPSRoutes(app: Router) {
  const router = Router();

  // Get server status
  router.get('/status', voipAuthMiddleware, async (req, res) => {
    try {
      const status = await openSIPSService.getServerStatus();
      const activeCalls = await openSIPSService.getActiveCalls();

      res.json({
        success: true,
        status: {
          ...status,
          activeCalls: activeCalls.length,
          registeredUsers: 0, // TODO: Implement user count
          uptime: status.status === 'running' ? '5h 32m' : '0m'
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Start server
  router.post('/start', voipAuthMiddleware, async (req, res) => {
    try {
      const started = await openSIPSService.startServer();
      res.json({
        success: started,
        message: started ? 'Server started successfully' : 'Failed to start server'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Stop server
  router.post('/stop', voipAuthMiddleware, async (req, res) => {
    try {
      const stopped = await openSIPSService.stopServer();
      res.json({
        success: stopped,
        message: stopped ? 'Server stopped successfully' : 'Failed to stop server'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Get active calls
  router.get('/calls', voipAuthMiddleware, async (req, res) => {
    try {
      const calls = await openSIPSService.getActiveCalls();
      res.json({
        success: true,
        calls
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Register SIP user
  router.post('/register', voipAuthMiddleware, async (req, res) => {
    try {
      const { username, password, domain } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: 'Username and password are required'
        });
      }

      const result = await openSIPSService.registerUser(username, password, domain);
      res.json({
        success: true,
        user: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Initiate call
  router.post('/call/initiate', voipAuthMiddleware, async (req, res) => {
    try {
      const { userId, fromNumber, toNumber, useTwilio } = req.body;

      if (!userId || !fromNumber || !toNumber) {
        return res.status(400).json({
          success: false,
          error: 'userId, fromNumber, and toNumber are required'
        });
      }

      const session = await openSIPSTwilioIntegration.initiateCall(
        userId,
        fromNumber,
        toNumber,
        useTwilio || false
      );

      res.json({
        success: true,
        session
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Get call session
  router.get('/call/:sessionId', voipAuthMiddleware, async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = openSIPSTwilioIntegration.getSession(sessionId);

      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }

      res.json({
        success: true,
        session
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // End call
  router.post('/call/:sessionId/end', voipAuthMiddleware, async (req, res) => {
    try {
      const { sessionId } = req.params;
      await openSIPSTwilioIntegration.endCall(sessionId);

      res.json({
        success: true,
        message: 'Call ended successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Health check
  router.get('/health', voipAuthMiddleware, async (req, res) => {
    try {
      const health = await openSIPSTwilioIntegration.healthCheck();
      res.json({
        success: true,
        health
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  app.use('/api/voip/opensips', router);
}