import { storage } from "./storage";

async function seed() {
  console.log("🌱 Starting database seed...\n");

  try {
    // Create sample clients
    console.log("Creating clients...");
    const client1 = await storage.createClient({
      name: "Acme Corporation",
      plan: "enterprise",
      status: "active",
      credits: "50000",
      phoneNumber: "+1-555-0100",
      settings: {
        timezone: "America/New_York",
        language: "en",
      }
    });

    const client2 = await storage.createClient({
      name: "Global Marketing Ltd",
      plan: "pro",
      status: "active",
      credits: "12400",
      phoneNumber: "+1-555-0101",
      settings: {
        timezone: "Europe/London",
        language: "en",
      }
    });

    const client3 = await storage.createClient({
      name: "TechStart Inc",
      plan: "starter",
      status: "active",
      credits: "1500",
      phoneNumber: "+1-555-0102",
    });

    console.log(`✅ Created ${3} clients\n`);

    // Create WhatsApp connections
    console.log("Creating WhatsApp connections...");
    await storage.createWhatsAppConnection({
      clientId: client1.id,
      phoneNumberId: "1234567890",
      businessAccountId: "BA_ACME_123",
      accessToken: "EAAxxxxxxxxxxxxxxxxxxxxx",
      displayName: "Acme Support",
      status: "connected",
    });

    await storage.createWhatsAppConnection({
      clientId: client2.id,
      phoneNumberId: "9876543210",
      businessAccountId: "BA_GLOBAL_456",
      accessToken: "EAAyyyyyyyyyyyyyyyyyyyyyy",
      displayName: "Global Marketing",
      status: "connected",
    });

    console.log(`✅ Created ${2} WhatsApp connections\n`);

    // Create contacts
    console.log("Creating contacts...");
    const contact1 = await storage.createContact({
      clientId: client1.id,
      phoneNumber: "+1-555-1001",
      name: "Alice Freeman",
      email: "alice@example.com",
      tags: ["premium", "interested"],
      isOptedIn: true,
    });

    const contact2 = await storage.createContact({
      clientId: client1.id,
      phoneNumber: "+1-555-1002",
      name: "Bob Smith",
      email: "bob@example.com",
      tags: ["customer"],
      isOptedIn: true,
    });

    const contact3 = await storage.createContact({
      clientId: client2.id,
      phoneNumber: "+1-555-2001",
      name: "Carol White",
      email: "carol@example.com",
      tags: ["lead"],
      isOptedIn: true,
    });

    console.log(`✅ Created ${3} contacts\n`);

    // Create campaigns
    console.log("Creating campaigns...");
    await storage.createCampaign({
      clientId: client1.id,
      name: "Black Friday Sale 2024",
      type: "marketing",
      status: "active",
      messageContent: "Don't miss our Black Friday deals! Get 50% off all products.",
      sentCount: "12500",
      deliveredCount: "12450",
      readCount: "9800",
      failedCount: "50",
      createdBy: "admin-user-id",
    });

    await storage.createCampaign({
      clientId: client1.id,
      name: "Welcome Series",
      type: "utility",
      status: "paused",
      messageContent: "Welcome to Acme! We're excited to have you.",
      sentCount: "3400",
      deliveredCount: "3390",
      readCount: "2800",
      failedCount: "10",
      createdBy: "admin-user-id",
    });

    await storage.createCampaign({
      clientId: client2.id,
      name: "Product Launch Announcement",
      type: "marketing",
      status: "scheduled",
      messageContent: "New product launching next week! Be the first to know.",
      sentCount: "0",
      deliveredCount: "0",
      readCount: "0",
      failedCount: "0",
      createdBy: "admin-user-id",
    });

    console.log(`✅ Created ${3} campaigns\n`);

    // Create conversations
    console.log("Creating conversations...");
    const conv1 = await storage.createConversation({
      clientId: client1.id,
      contactId: contact1.id,
      status: "open",
      unreadCount: "2",
    });

    const conv2 = await storage.createConversation({
      clientId: client1.id,
      contactId: contact2.id,
      status: "resolved",
      unreadCount: "0",
    });

    console.log(`✅ Created ${2} conversations\n`);

    // Create messages
    console.log("Creating messages...");
    await storage.createMessage({
      conversationId: conv1.id,
      clientId: client1.id,
      direction: "inbound",
      fromNumber: "+1-555-1001",
      toNumber: "+1-555-0100",
      messageType: "text",
      content: "Hi! I'm interested in your Enterprise plan",
      status: "delivered",
    });

    await storage.createMessage({
      conversationId: conv1.id,
      clientId: client1.id,
      direction: "outbound",
      fromNumber: "+1-555-0100",
      toNumber: "+1-555-1001",
      messageType: "text",
      content: "Hello Alice! I'd be happy to help you with that. The Enterprise plan includes...",
      status: "read",
    });

    await storage.createMessage({
      conversationId: conv2.id,
      clientId: client1.id,
      direction: "inbound",
      fromNumber: "+1-555-1002",
      toNumber: "+1-555-0100",
      messageType: "text",
      content: "Thanks for the help!",
      status: "delivered",
    });

    console.log(`✅ Created ${3} messages\n`);

    console.log("✨ Database seeded successfully!\n");
    console.log("Summary:");
    console.log(`  - ${3} Clients`);
    console.log(`  - ${2} WhatsApp Connections`);
    console.log(`  - ${3} Contacts`);
    console.log(`  - ${3} Campaigns`);
    console.log(`  - ${2} Conversations`);
    console.log(`  - ${3} Messages`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
