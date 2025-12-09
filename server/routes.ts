import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { whatsappService } from "./whatsapp";
import { 
  insertClientSchema, insertContactSchema, insertCampaignSchema,
  insertWhatsAppConnectionSchema, insertConversationSchema, insertMessageSchema, insertTeamAssignmentSchema
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ==================== CLIENTS MANAGEMENT ====================
  
  app.get("/api/clients", async (req, res) => {
    try {
      const allClients = await storage.getAllClients();
      res.json(allClients);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const newClient = await storage.createClient(validatedData);
      res.status(201).json(newClient);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/clients/:id", async (req, res) => {
    try {
      const updated = await storage.updateClient(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteClient(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== WHATSAPP CONNECTIONS ====================

  app.get("/api/clients/:clientId/whatsapp-connections", async (req, res) => {
    try {
      const connections = await storage.getWhatsAppConnectionsByClient(req.params.clientId);
      res.json(connections);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/whatsapp-connections", async (req, res) => {
    try {
      const validatedData = insertWhatsAppConnectionSchema.parse(req.body);
      const newConnection = await storage.createWhatsAppConnection(validatedData);
      res.status(201).json(newConnection);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/whatsapp-connections/:id", async (req, res) => {
    try {
      const updated = await storage.updateWhatsAppConnection(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Connection not found" });
      }
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== CONTACTS ====================

  app.get("/api/clients/:clientId/contacts", async (req, res) => {
    try {
      const clientContacts = await storage.getContactsByClient(req.params.clientId);
      res.json(clientContacts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const newContact = await storage.createContact(validatedData);
      res.status(201).json(newContact);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/contacts/:id", async (req, res) => {
    try {
      const updated = await storage.updateContact(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteContact(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== CAMPAIGNS ====================

  app.get("/api/clients/:clientId/campaigns", async (req, res) => {
    try {
      const clientCampaigns = await storage.getCampaignsByClient(req.params.clientId);
      res.json(clientCampaigns);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const validatedData = insertCampaignSchema.parse(req.body);
      const newCampaign = await storage.createCampaign(validatedData);
      res.status(201).json(newCampaign);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/campaigns/:id", async (req, res) => {
    try {
      const updated = await storage.updateCampaign(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/campaigns/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCampaign(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== CONVERSATIONS ====================

  app.get("/api/clients/:clientId/conversations", async (req, res) => {
    try {
      const clientConvos = await storage.getConversationsByClient(req.params.clientId);
      res.json(clientConvos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/conversations", async (req, res) => {
    try {
      const validatedData = insertConversationSchema.parse(req.body);
      const newConversation = await storage.createConversation(validatedData);
      res.status(201).json(newConversation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/conversations/:id", async (req, res) => {
    try {
      const updated = await storage.updateConversation(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== MESSAGES ====================

  app.get("/api/conversations/:conversationId/messages", async (req, res) => {
    try {
      const conversationMessages = await storage.getMessagesByConversation(req.params.conversationId);
      res.json(conversationMessages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const newMessage = await storage.createMessage(validatedData);
      
      // TODO: Actually send via WhatsApp Business API here
      // For now, just save to DB
      
      res.status(201).json(newMessage);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/messages/:id", async (req, res) => {
    try {
      const updated = await storage.updateMessage(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== TEAM ASSIGNMENTS ====================

  app.get("/api/clients/:clientId/team", async (req, res) => {
    try {
      const teamMembers = await storage.getTeamAssignmentsByClient(req.params.clientId);
      res.json(teamMembers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/team-assignments", async (req, res) => {
    try {
      const validatedData = insertTeamAssignmentSchema.parse(req.body);
      const newAssignment = await storage.createTeamAssignment(validatedData);
      res.status(201).json(newAssignment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/team-assignments/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTeamAssignment(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Team assignment not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== WHATSAPP WEBHOOK ====================
  
  // Webhook verification (GET)
  app.get("/api/whatsapp/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  });

  // Webhook receiver (POST)
  app.post("/api/whatsapp/webhook", async (req, res) => {
    try {
      const webhookData = whatsappService.parseWebhookMessage(req.body);
      
      if (!webhookData) {
        return res.sendStatus(200);
      }

      if (webhookData.type === "message") {
        // Find the connection by phone number
        const allClients = await storage.getAllClients();
        let targetClientId: string | null = null;
        
        for (const client of allClients) {
          const connections = await storage.getWhatsAppConnectionsByClient(client.id);
          if (connections.some(c => c.phoneNumberId === webhookData.from)) {
            targetClientId = client.id;
            break;
          }
        }
        
        if (!targetClientId) {
          console.log("No client found for incoming message");
          return res.sendStatus(200);
        }

        // Find or create contact
        let contacts = await storage.getContactsByClient(targetClientId);
        let contact = contacts.find(c => c.phoneNumber === webhookData.from);
        
        if (!contact) {
          contact = await storage.createContact({
            clientId: targetClientId,
            phoneNumber: webhookData.from,
            name: webhookData.contacts?.name || "Unknown",
            isOptedIn: true
          });
        }

        // Find or create conversation
        const conversations = await storage.getConversationsByClient(targetClientId);
        let conversation = conversations.find(c => c.contactId === contact!.id);
        
        if (!conversation) {
          conversation = await storage.createConversation({
            clientId: targetClientId,
            contactId: contact.id,
            status: "open"
          });
        }

        // Save the message
        await storage.createMessage({
          conversationId: conversation.id,
          clientId: targetClientId,
          direction: "inbound",
          whatsappMessageId: webhookData.messageId,
          fromNumber: webhookData.from,
          toNumber: "", // Business number
          messageType: webhookData.messageType,
          content: webhookData.text || "",
          mediaUrl: webhookData.mediaUrl,
          status: "delivered"
        });

        // Update conversation
        await storage.updateConversation(conversation.id, {
          lastMessageAt: new Date(),
          unreadCount: (parseInt(conversation.unreadCount || "0") + 1).toString()
        });
      }

      if (webhookData.type === "status") {
        // Update message status
        const allClients = await storage.getAllClients();
        
        for (const client of allClients) {
          const conversations = await storage.getConversationsByClient(client.id);
          for (const conv of conversations) {
            const messages = await storage.getMessagesByConversation(conv.id);
            const message = messages.find(m => m.whatsappMessageId === webhookData.messageId);
            
            if (message) {
              await storage.updateMessage(message.id, {
                status: webhookData.status
              });
              break;
            }
          }
        }
      }
      
      res.sendStatus(200);
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.sendStatus(500);
    }
  });

  // ==================== WHATSAPP SEND MESSAGE ====================
  
  app.post("/api/whatsapp/send-message", async (req, res) => {
    try {
      const { clientId, to, message, type = "text", connectionId, mediaUrl } = req.body;
      
      // Get WhatsApp connection - use specific one if provided, otherwise default
      let connection;
      if (connectionId) {
        const allConnections = await storage.getWhatsAppConnectionsByClient(clientId);
        connection = allConnections.find(c => c.id === connectionId);
      } else {
        const connections = await storage.getWhatsAppConnectionsByClient(clientId);
        connection = connections[0];
      }
      
      if (!connection) {
        return res.status(400).json({ error: "No WhatsApp connection found for client" });
      }
      
      // Send actual message via WhatsApp Business Cloud API
      let whatsappResponse;
      try {
        if (type === "text") {
          whatsappResponse = await whatsappService.sendTextMessage({
            phoneNumberId: connection.phoneNumberId,
            accessToken: connection.accessToken,
            to,
            message
          });
        } else {
          whatsappResponse = await whatsappService.sendMediaMessage({
            phoneNumberId: connection.phoneNumberId,
            accessToken: connection.accessToken,
            to,
            message,
            mediaUrl,
            type
          });
        }
      } catch (whatsappError: any) {
        // Save failed message
        const failedMessage = await storage.createMessage({
          clientId,
          direction: "outbound",
          fromNumber: connection.phoneNumberId,
          toNumber: to,
          messageType: type,
          content: message,
          mediaUrl,
          status: "failed",
          errorMessage: whatsappError.message
        });
        return res.status(500).json({ error: whatsappError.message, message: failedMessage });
      }
      
      const savedMessage = await storage.createMessage({
        clientId,
        direction: "outbound",
        fromNumber: connection.phoneNumberId,
        toNumber: to,
        messageType: type,
        content: message,
        mediaUrl,
        status: "sent",
        whatsappMessageId: whatsappResponse.messages[0].id
      });
      
      res.status(201).json(savedMessage);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ==================== LAUNCH CAMPAIGN ====================
  
  app.post("/api/campaigns/:id/launch", async (req, res) => {
    try {
      const campaign = await storage.getCampaignById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }

      // Get target contacts
      const contacts = await storage.getContactsByClient(campaign.clientId);
      const targetContacts = contacts.filter((c: any) => c.isOptedIn);

      // Get WhatsApp connection
      const connections = await storage.getWhatsAppConnectionsByClient(campaign.clientId);
      if (connections.length === 0) {
        return res.status(400).json({ error: "No WhatsApp connection configured" });
      }
      const connection = connections[0];

      // Send messages in batch with rate limiting
      let sentCount = 0;
      let failedCount = 0;
      let deliveredCount = 0;

      for (const contact of targetContacts) {
        try {
          // Personalize message (replace variables)
          let personalizedMessage = campaign.messageContent || "";
          personalizedMessage = personalizedMessage.replace(/\{\{name\}\}/g, contact.name || "");
          personalizedMessage = personalizedMessage.replace(/\{\{phone\}\}/g, contact.phoneNumber);
          
          // Send via WhatsApp API
          const whatsappResponse = await whatsappService.sendTextMessage({
            phoneNumberId: connection.phoneNumberId,
            accessToken: connection.accessToken,
            to: contact.phoneNumber,
            message: personalizedMessage
          });

          await storage.createMessage({
            campaignId: campaign.id,
            clientId: campaign.clientId,
            direction: "outbound",
            fromNumber: connection.phoneNumberId,
            toNumber: contact.phoneNumber,
            messageType: "text",
            content: personalizedMessage,
            status: "sent",
            whatsappMessageId: whatsappResponse.messages[0].id
          });
          
          sentCount++;
          
          // Rate limiting: Wait 1 second between messages
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err: any) {
          console.error(`Failed to send to ${contact.phoneNumber}:`, err.message);
          
          await storage.createMessage({
            campaignId: campaign.id,
            clientId: campaign.clientId,
            direction: "outbound",
            fromNumber: connection.phoneNumberId,
            toNumber: contact.phoneNumber,
            messageType: "text",
            content: campaign.messageContent || "",
            status: "failed",
            errorMessage: err.message
          });
          
          failedCount++;
        }
      }

      // Update campaign stats
      const updated = await storage.updateCampaign(campaign.id, {
        status: "completed",
        sentCount: sentCount.toString(),
        deliveredCount: deliveredCount.toString(),
        failedCount: failedCount.toString()
      });

      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return httpServer;
}
