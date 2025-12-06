
import { Router } from 'express';
import { WhatsAppService } from '../services/whatsapp';

const router = Router();
const whatsappService = new WhatsAppService();

// Send WhatsApp Message
router.post('/messages/send', async (req, res) => {
  try {
    const { to, message, type } = req.body;
    const result = await whatsappService.sendMessage(to, message, type);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Send Template Message
router.post('/messages/template', async (req, res) => {
  try {
    const { to, templateName, language, components } = req.body;
    const result = await whatsappService.sendTemplate(to, templateName, language, components);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Webhook Verification
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook Handler
router.post('/webhook', async (req, res) => {
  try {
    await whatsappService.handleWebhook(req.body);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get Message Status
router.get('/messages/:messageId', async (req, res) => {
  try {
    const status = await whatsappService.getMessageStatus(req.params.messageId);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Upload Media
router.post('/media/upload', async (req, res) => {
  try {
    const { url, mimeType } = req.body;
    const mediaId = await whatsappService.uploadMedia(url, mimeType);
    res.json({ mediaId });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
