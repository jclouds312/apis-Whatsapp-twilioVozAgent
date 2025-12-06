
import { Router } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
const router = Router();

// Store VoIP configuration
let voipConfig = {
  sipServer: process.env.SIP_SERVER || '',
  sipPort: parseInt(process.env.SIP_PORT || '5060'),
  username: process.env.SIP_USERNAME || '',
  password: process.env.SIP_PASSWORD || '',
};

// Initialize VoIP service
router.post('/initialize', async (req, res) => {
  try {
    const { sipServer, sipPort, username, password } = req.body;
    
    voipConfig = {
      sipServer: sipServer || voipConfig.sipServer,
      sipPort: sipPort || voipConfig.sipPort,
      username: username || voipConfig.username,
      password: password || voipConfig.password,
    };
    
    // Call Python script to initialize VoIP
    const pythonScript = `
import sys
sys.path.append('server')
from pyvoip_integration import initialize_voip

result = initialize_voip('${voipConfig.sipServer}', ${voipConfig.sipPort}, '${voipConfig.username}', '${voipConfig.password}')
print('success' if result else 'failed')
`;
    
    const { stdout } = await execPromise(`python3 -c "${pythonScript.replace(/\n/g, '; ')}"`);
    
    if (stdout.trim() === 'success') {
      res.json({ success: true, message: 'VoIP initialized successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to initialize VoIP' });
    }
  } catch (error) {
    console.error('VoIP initialization error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Make an outbound call
router.post('/call', async (req, res) => {
  try {
    const { number } = req.body;
    
    if (!number) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }
    
    const pythonScript = `
import sys
sys.path.append('server')
from pyvoip_integration import get_voip_manager

manager = get_voip_manager()
if manager:
    call_id = manager.make_call('${number}')
    print(call_id if call_id else 'failed')
else:
    print('not_initialized')
`;
    
    const { stdout } = await execPromise(`python3 -c "${pythonScript.replace(/\n/g, '; ')}"`);
    const result = stdout.trim();
    
    if (result === 'failed' || result === 'not_initialized') {
      res.status(500).json({ success: false, message: 'Failed to make call' });
    } else {
      res.json({ success: true, callId: result });
    }
  } catch (error) {
    console.error('Call error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Answer a call
router.post('/answer/:callId', async (req, res) => {
  try {
    const { callId } = req.params;
    
    const pythonScript = `
import sys
sys.path.append('server')
from pyvoip_integration import get_voip_manager

manager = get_voip_manager()
if manager:
    success = manager.answer_call('${callId}')
    print('success' if success else 'failed')
else:
    print('not_initialized')
`;
    
    const { stdout } = await execPromise(`python3 -c "${pythonScript.replace(/\n/g, '; ')}"`);
    const result = stdout.trim();
    
    if (result === 'success') {
      res.json({ success: true, message: 'Call answered' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to answer call' });
    }
  } catch (error) {
    console.error('Answer call error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Hang up a call
router.post('/hangup/:callId', async (req, res) => {
  try {
    const { callId } = req.params;
    
    const pythonScript = `
import sys
sys.path.append('server')
from pyvoip_integration import get_voip_manager

manager = get_voip_manager()
if manager:
    success = manager.hangup_call('${callId}')
    print('success' if success else 'failed')
else:
    print('not_initialized')
`;
    
    const { stdout } = await execPromise(`python3 -c "${pythonScript.replace(/\n/g, '; ')}"`);
    const result = stdout.trim();
    
    if (result === 'success') {
      res.json({ success: true, message: 'Call ended' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to end call' });
    }
  } catch (error) {
    console.error('Hangup call error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get call status
router.get('/status/:callId', async (req, res) => {
  try {
    const { callId } = req.params;
    
    const pythonScript = `
import sys
sys.path.append('server')
from pyvoip_integration import get_voip_manager

manager = get_voip_manager()
if manager:
    state = manager.get_call_state('${callId}')
    print(state if state else 'not_found')
else:
    print('not_initialized')
`;
    
    const { stdout } = await execPromise(`python3 -c "${pythonScript.replace(/\n/g, '; ')}"`);
    const state = stdout.trim();
    
    if (state === 'not_found' || state === 'not_initialized') {
      res.status(404).json({ success: false, message: 'Call not found' });
    } else {
      res.json({ success: true, state });
    }
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
