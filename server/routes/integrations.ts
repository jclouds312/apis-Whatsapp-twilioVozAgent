
import { Router } from 'express';
import { PyVoIPService } from '../services/integrations/pyvoip-service';
import { DoorPiService } from '../services/integrations/doorpi-service';
import { WhatsAppCloudService } from '../services/integrations/whatsapp-cloud-service';
import { TerraformTwilioService } from '../services/integrations/terraform-twilio-service';

const router = Router();

// PyVoIP Routes
router.post('/pyvoip/initialize', async (req, res) => {
  try {
    const service = new PyVoIPService();
    const result = await service.initializeVoIPServer();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/pyvoip/call', async (req, res) => {
  try {
    const { to, from } = req.body;
    const service = new PyVoIPService();
    const result = await service.makeCall(to, from);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DoorPi Routes
router.post('/doorpi/initialize', async (req, res) => {
  try {
    const service = new DoorPiService();
    const result = await service.initializeDoorPi(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/doorpi/trigger', async (req, res) => {
  try {
    const service = new DoorPiService();
    const result = await service.triggerDoorOpen();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/doorpi/rfid', async (req, res) => {
  try {
    const service = new DoorPiService();
    const result = await service.readRFID();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// WhatsApp Cloud API Routes
router.post('/whatsapp-cloud/interactive', async (req, res) => {
  try {
    const { to, interactive } = req.body;
    const service = new WhatsAppCloudService();
    const result = await service.sendInteractiveMessage(to, interactive);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/whatsapp-cloud/template', async (req, res) => {
  try {
    const { to, templateName, language, components } = req.body;
    const service = new WhatsAppCloudService();
    const result = await service.sendTemplateMessage(to, templateName, language, components);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/whatsapp-cloud/media', async (req, res) => {
  try {
    const { mediaUrl, mimeType } = req.body;
    const service = new WhatsAppCloudService();
    const result = await service.uploadMedia(mediaUrl, mimeType);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/whatsapp-cloud/flow', async (req, res) => {
  try {
    const { name, categories } = req.body;
    const service = new WhatsAppCloudService();
    const result = await service.createFlow(name, categories);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Terraform Twilio Routes
router.post('/terraform/init', async (req, res) => {
  try {
    const service = new TerraformTwilioService();
    const result = await service.initializeTerraform();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/terraform/plan', async (req, res) => {
  try {
    const service = new TerraformTwilioService();
    const result = await service.planInfrastructure(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/terraform/apply', async (req, res) => {
  try {
    const { autoApprove } = req.body;
    const service = new TerraformTwilioService();
    const result = await service.applyInfrastructure(autoApprove);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/terraform/outputs', async (req, res) => {
  try {
    const service = new TerraformTwilioService();
    const result = await service.getOutputs();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
