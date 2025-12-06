
import { Router } from 'express';
import { VoIPService } from '../services/voip';

const router = Router();
const voipService = new VoIPService();

// Initialize Voice Call
router.post('/calls/initiate', async (req, res) => {
  try {
    const { to, from, identity } = req.body;
    const call = await voipService.initiateCall(to, from, identity);
    res.json(call);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get Access Token for Voice
router.post('/token', async (req, res) => {
  try {
    const { identity } = req.body;
    const token = await voipService.generateVoiceToken(identity);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Handle Incoming Call
router.post('/calls/incoming', async (req, res) => {
  try {
    const twiml = await voipService.handleIncomingCall(req.body);
    res.type('text/xml');
    res.send(twiml);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get Call Status
router.get('/calls/:callSid', async (req, res) => {
  try {
    const call = await voipService.getCallStatus(req.params.callSid);
    res.json(call);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// End Call
router.post('/calls/:callSid/end', async (req, res) => {
  try {
    await voipService.endCall(req.params.callSid);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Record Call
router.post('/calls/:callSid/record', async (req, res) => {
  try {
    const recording = await voipService.recordCall(req.params.callSid);
    res.json(recording);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
