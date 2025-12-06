
import { Router } from 'express';
import { APIGeneratorService } from '../services/api-generator';

const router = Router();
const apiGenerator = new APIGeneratorService();

// Generate new API Key
router.post('/keys/generate', async (req, res) => {
  try {
    const { name, permissions, expiresIn } = req.body;
    const apiKey = await apiGenerator.generateKey(name, permissions, expiresIn);
    res.json(apiKey);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// List API Keys
router.get('/keys', async (req, res) => {
  try {
    const keys = await apiGenerator.listKeys();
    res.json(keys);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Revoke API Key
router.delete('/keys/:keyId', async (req, res) => {
  try {
    await apiGenerator.revokeKey(req.params.keyId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Validate API Key
router.post('/keys/validate', async (req, res) => {
  try {
    const { apiKey } = req.body;
    const isValid = await apiGenerator.validateKey(apiKey);
    res.json({ valid: isValid });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get Key Usage
router.get('/keys/:keyId/usage', async (req, res) => {
  try {
    const usage = await apiGenerator.getKeyUsage(req.params.keyId);
    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
