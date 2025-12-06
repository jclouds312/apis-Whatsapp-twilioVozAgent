import { db } from "./db";
import { 
  users, contacts, messages, calls, workflows, knowledgeDocuments, agentSessions,
  type User, type InsertUser,
  type Contact, type InsertContact,
  type Message, type InsertMessage,
  type Call, type InsertCall,
  type Workflow, type InsertWorkflow,
  type KnowledgeDocument, type InsertKnowledgeDocument,
  type AgentSession, type InsertAgentSession
} from "@shared/schema";
import { eq, desc, sql, and, gte } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Contacts
  getAllContacts(): Promise<Contact[]>;
  getContact(id: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<boolean>;
  searchContacts(query: string): Promise<Contact[]>;

  // Messages
  getAllMessages(limit?: number): Promise<Message[]>;
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByContact(contactId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessageStatus(id: number, status: string): Promise<Message | undefined>;

  // Calls
  getAllCalls(limit?: number): Promise<Call[]>;
  getCall(id: number): Promise<Call | undefined>;
  getCallsByContact(contactId: number): Promise<Call[]>;
  createCall(call: InsertCall): Promise<Call>;
  updateCall(id: number, call: Partial<InsertCall>): Promise<Call | undefined>;

  // Workflows
  getAllWorkflows(): Promise<Workflow[]>;
  getWorkflow(id: number): Promise<Workflow | undefined>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: number, workflow: Partial<InsertWorkflow>): Promise<Workflow | undefined>;
  deleteWorkflow(id: number): Promise<boolean>;

  // Knowledge Documents
  getAllKnowledgeDocuments(): Promise<KnowledgeDocument[]>;
  getKnowledgeDocument(id: number): Promise<KnowledgeDocument | undefined>;
  createKnowledgeDocument(doc: InsertKnowledgeDocument): Promise<KnowledgeDocument>;
  updateKnowledgeDocument(id: number, doc: Partial<InsertKnowledgeDocument>): Promise<KnowledgeDocument | undefined>;
  deleteKnowledgeDocument(id: number): Promise<boolean>;

  // Agent Sessions
  getActiveSession(contactId: number): Promise<AgentSession | undefined>;
  createAgentSession(session: InsertAgentSession): Promise<AgentSession>;
  updateAgentSession(id: number, session: Partial<InsertAgentSession>): Promise<AgentSession | undefined>;
  endAgentSession(id: number): Promise<AgentSession | undefined>;

  // Dashboard Stats
  getDashboardStats(): Promise<{
    activeCalls: number;
    totalMessages24h: number;
    activeAgents: number;
    avgLatency: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Contacts
  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getContact(id: number): Promise<Contact | undefined> {
    const result = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
    return result[0];
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const result = await db.insert(contacts).values(contact).returning();
    return result[0];
  }

  async updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact | undefined> {
    const result = await db.update(contacts).set(contact).where(eq(contacts.id, id)).returning();
    return result[0];
  }

  async deleteContact(id: number): Promise<boolean> {
    const result = await db.delete(contacts).where(eq(contacts.id, id)).returning();
    return result.length > 0;
  }

  async searchContacts(query: string): Promise<Contact[]> {
    return await db.select().from(contacts)
      .where(sql`${contacts.name} ILIKE ${'%' + query + '%'} OR ${contacts.phone} ILIKE ${'%' + query + '%'}`)
      .orderBy(desc(contacts.createdAt));
  }

  // Messages
  async getAllMessages(limit: number = 100): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt)).limit(limit);
  }

  async getMessage(id: number): Promise<Message | undefined> {
    const result = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
    return result[0];
  }

  async getMessagesByContact(contactId: number): Promise<Message[]> {
    return await db.select().from(messages)
      .where(eq(messages.contactId, contactId))
      .orderBy(desc(messages.createdAt));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async updateMessageStatus(id: number, status: string): Promise<Message | undefined> {
    const result = await db.update(messages).set({ status }).where(eq(messages.id, id)).returning();
    return result[0];
  }

  // Calls
  async getAllCalls(limit: number = 100): Promise<Call[]> {
    return await db.select().from(calls).orderBy(desc(calls.createdAt)).limit(limit);
  }

  async getCall(id: number): Promise<Call | undefined> {
    const result = await db.select().from(calls).where(eq(calls.id, id)).limit(1);
    return result[0];
  }

  async getCallsByContact(contactId: number): Promise<Call[]> {
    return await db.select().from(calls)
      .where(eq(calls.contactId, contactId))
      .orderBy(desc(calls.createdAt));
  }

  async createCall(call: InsertCall): Promise<Call> {
    const result = await db.insert(calls).values(call).returning();
    return result[0];
  }

  async updateCall(id: number, call: Partial<InsertCall>): Promise<Call | undefined> {
    const result = await db.update(calls).set(call).where(eq(calls.id, id)).returning();
    return result[0];
  }

  // Workflows
  async getAllWorkflows(): Promise<Workflow[]> {
    return await db.select().from(workflows).orderBy(desc(workflows.updatedAt));
  }

  async getWorkflow(id: number): Promise<Workflow | undefined> {
    const result = await db.select().from(workflows).where(eq(workflows.id, id)).limit(1);
    return result[0];
  }

  async createWorkflow(workflow: InsertWorkflow): Promise<Workflow> {
    const result = await db.insert(workflows).values(workflow).returning();
    return result[0];
  }

  async updateWorkflow(id: number, workflow: Partial<InsertWorkflow>): Promise<Workflow | undefined> {
    const result = await db.update(workflows)
      .set({ ...workflow, updatedAt: new Date() })
      .where(eq(workflows.id, id))
      .returning();
    return result[0];
  }

  async deleteWorkflow(id: number): Promise<boolean> {
    const result = await db.delete(workflows).where(eq(workflows.id, id)).returning();
    return result.length > 0;
  }

  // Knowledge Documents
  async getAllKnowledgeDocuments(): Promise<KnowledgeDocument[]> {
    return await db.select().from(knowledgeDocuments).orderBy(desc(knowledgeDocuments.createdAt));
  }

  async getKnowledgeDocument(id: number): Promise<KnowledgeDocument | undefined> {
    const result = await db.select().from(knowledgeDocuments).where(eq(knowledgeDocuments.id, id)).limit(1);
    return result[0];
  }

  async createKnowledgeDocument(doc: InsertKnowledgeDocument): Promise<KnowledgeDocument> {
    const result = await db.insert(knowledgeDocuments).values(doc).returning();
    return result[0];
  }

  async updateKnowledgeDocument(id: number, doc: Partial<InsertKnowledgeDocument>): Promise<KnowledgeDocument | undefined> {
    const result = await db.update(knowledgeDocuments).set(doc).where(eq(knowledgeDocuments.id, id)).returning();
    return result[0];
  }

  async deleteKnowledgeDocument(id: number): Promise<boolean> {
    const result = await db.delete(knowledgeDocuments).where(eq(knowledgeDocuments.id, id)).returning();
    return result.length > 0;
  }

  // Agent Sessions
  async getActiveSession(contactId: number): Promise<AgentSession | undefined> {
    const result = await db.select().from(agentSessions)
      .where(and(
        eq(agentSessions.contactId, contactId),
        eq(agentSessions.status, 'active')
      ))
      .limit(1);
    return result[0];
  }

  async createAgentSession(session: InsertAgentSession): Promise<AgentSession> {
    const result = await db.insert(agentSessions).values(session).returning();
    return result[0];
  }

  async updateAgentSession(id: number, session: Partial<InsertAgentSession>): Promise<AgentSession | undefined> {
    const result = await db.update(agentSessions).set(session).where(eq(agentSessions.id, id)).returning();
    return result[0];
  }

  async endAgentSession(id: number): Promise<AgentSession | undefined> {
    const result = await db.update(agentSessions)
      .set({ status: 'completed', endedAt: new Date() })
      .where(eq(agentSessions.id, id))
      .returning();
    return result[0];
  }

  // Dashboard Stats
  async getDashboardStats() {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Count active calls
    const activeCallsResult = await db.select({ count: sql<number>`count(*)` })
      .from(calls)
      .where(eq(calls.status, 'in-progress'));
    const activeCalls = Number(activeCallsResult[0]?.count || 0);

    // Count messages in last 24h
    const messagesResult = await db.select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(gte(messages.createdAt, yesterday));
    const totalMessages24h = Number(messagesResult[0]?.count || 0);

    // Count active agent sessions
    const activeSessionsResult = await db.select({ count: sql<number>`count(*)` })
      .from(agentSessions)
      .where(eq(agentSessions.status, 'active'));
    const activeAgents = Number(activeSessionsResult[0]?.count || 0);

    return {
      activeCalls,
      totalMessages24h,
      activeAgents,
      avgLatency: 450, // Mock for now
    };
  }
}

export const storage = new DatabaseStorage();
