import { 
  type User, type InsertUser,
  type Client, type InsertClient,
  type WhatsAppConnection, type InsertWhatsAppConnection,
  type Contact, type InsertContact,
  type Campaign, type InsertCampaign,
  type Conversation, type InsertConversation,
  type Message, type InsertMessage,
  type TeamAssignment, type InsertTeamAssignment,
  users, clients, whatsappConnections, contacts, campaigns, conversations, messages, teamAssignments
} from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import { eq, and, desc } from "drizzle-orm";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export interface IStorage {
  // ===== USERS =====
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // ===== CLIENTS =====
  getAllClients(): Promise<Client[]>;
  getClient(id: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, updates: Partial<Client>): Promise<Client | undefined>;
  deleteClient(id: string): Promise<boolean>;

  // ===== WHATSAPP CONNECTIONS =====
  getWhatsAppConnectionsByClient(clientId: string): Promise<WhatsAppConnection[]>;
  getWhatsAppConnection(id: string): Promise<WhatsAppConnection | undefined>;
  createWhatsAppConnection(connection: InsertWhatsAppConnection): Promise<WhatsAppConnection>;
  updateWhatsAppConnection(id: string, updates: Partial<WhatsAppConnection>): Promise<WhatsAppConnection | undefined>;

  // ===== CONTACTS =====
  getContactsByClient(clientId: string): Promise<Contact[]>;
  getContact(id: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: string, updates: Partial<Contact>): Promise<Contact | undefined>;
  deleteContact(id: string): Promise<boolean>;

  // ===== CAMPAIGNS =====
  getCampaignsByClient(clientId: string): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  getCampaignById(id: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: string): Promise<boolean>;

  // ===== CONVERSATIONS =====
  getConversationsByClient(clientId: string): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined>;

  // ===== MESSAGES =====
  getMessagesByConversation(conversationId: string): Promise<Message[]>;
  getMessage(id: string): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: string, updates: Partial<Message>): Promise<Message | undefined>;

  // ===== TEAM ASSIGNMENTS =====
  getTeamAssignmentsByClient(clientId: string): Promise<TeamAssignment[]>;
  getTeamAssignmentsByUser(userId: string): Promise<TeamAssignment[]>;
  createTeamAssignment(assignment: InsertTeamAssignment): Promise<TeamAssignment>;
  deleteTeamAssignment(id: string): Promise<boolean>;
}

export class PostgresStorage implements IStorage {
  // ===== USERS =====
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  // ===== CLIENTS =====
  async getAllClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async getClient(id: string): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
    return result[0];
  }

  async createClient(client: InsertClient): Promise<Client> {
    const result = await db.insert(clients).values(client).returning();
    return result[0];
  }

  async updateClient(id: string, updates: Partial<Client>): Promise<Client | undefined> {
    const result = await db.update(clients).set(updates).where(eq(clients.id, id)).returning();
    return result[0];
  }

  async deleteClient(id: string): Promise<boolean> {
    const result = await db.delete(clients).where(eq(clients.id, id)).returning();
    return result.length > 0;
  }

  // ===== WHATSAPP CONNECTIONS =====
  async getWhatsAppConnectionsByClient(clientId: string): Promise<WhatsAppConnection[]> {
    return await db.select().from(whatsappConnections).where(eq(whatsappConnections.clientId, clientId));
  }

  async getWhatsAppConnection(id: string): Promise<WhatsAppConnection | undefined> {
    const result = await db.select().from(whatsappConnections).where(eq(whatsappConnections.id, id)).limit(1);
    return result[0];
  }

  async createWhatsAppConnection(connection: InsertWhatsAppConnection): Promise<WhatsAppConnection> {
    const result = await db.insert(whatsappConnections).values(connection).returning();
    return result[0];
  }

  async updateWhatsAppConnection(id: string, updates: Partial<WhatsAppConnection>): Promise<WhatsAppConnection | undefined> {
    const result = await db.update(whatsappConnections).set(updates).where(eq(whatsappConnections.id, id)).returning();
    return result[0];
  }

  // ===== CONTACTS =====
  async getContactsByClient(clientId: string): Promise<Contact[]> {
    return await db.select().from(contacts).where(eq(contacts.clientId, clientId)).orderBy(desc(contacts.createdAt));
  }

  async getContact(id: string): Promise<Contact | undefined> {
    const result = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
    return result[0];
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const result = await db.insert(contacts).values(contact).returning();
    return result[0];
  }

  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact | undefined> {
    const result = await db.update(contacts).set(updates).where(eq(contacts.id, id)).returning();
    return result[0];
  }

  async deleteContact(id: string): Promise<boolean> {
    const result = await db.delete(contacts).where(eq(contacts.id, id)).returning();
    return result.length > 0;
  }

  // ===== CAMPAIGNS =====
  async getCampaignsByClient(clientId: string): Promise<Campaign[]> {
    return await db.select().from(campaigns).where(eq(campaigns.clientId, clientId)).orderBy(desc(campaigns.createdAt));
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    const result = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
    return result[0];
  }

  async getCampaignById(id: string): Promise<Campaign | undefined> {
    const result = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return result[0];
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const result = await db.insert(campaigns).values(campaign).returning();
    return result[0];
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const result = await db.update(campaigns).set(updates).where(eq(campaigns.id, id)).returning();
    return result[0];
  }

  async deleteCampaign(id: string): Promise<boolean> {
    const result = await db.delete(campaigns).where(eq(campaigns.id, id)).returning();
    return result.length > 0;
  }

  // ===== CONVERSATIONS =====
  async getConversationsByClient(clientId: string): Promise<Conversation[]> {
    return await db.select().from(conversations).where(eq(conversations.clientId, clientId)).orderBy(desc(conversations.lastMessageAt));
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const result = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
    return result[0];
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const result = await db.insert(conversations).values(conversation).returning();
    return result[0];
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const result = await db.update(conversations).set(updates).where(eq(conversations.id, id)).returning();
    return result[0];
  }

  // ===== MESSAGES =====
  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
  }

  async getMessage(id: string): Promise<Message | undefined> {
    const result = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
    return result[0];
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async updateMessage(id: string, updates: Partial<Message>): Promise<Message | undefined> {
    const result = await db.update(messages).set(updates).where(eq(messages.id, id)).returning();
    return result[0];
  }

  // ===== TEAM ASSIGNMENTS =====
  async getTeamAssignmentsByClient(clientId: string): Promise<TeamAssignment[]> {
    return await db.select().from(teamAssignments).where(eq(teamAssignments.clientId, clientId));
  }

  async getTeamAssignmentsByUser(userId: string): Promise<TeamAssignment[]> {
    return await db.select().from(teamAssignments).where(eq(teamAssignments.userId, userId));
  }

  async createTeamAssignment(assignment: InsertTeamAssignment): Promise<TeamAssignment> {
    const result = await db.insert(teamAssignments).values(assignment).returning();
    return result[0];
  }

  async deleteTeamAssignment(id: string): Promise<boolean> {
    const result = await db.delete(teamAssignments).where(eq(teamAssignments.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new PostgresStorage();