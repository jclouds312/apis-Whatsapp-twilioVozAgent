import { and, eq, like } from "drizzle-orm";
import { type InferSelectModel } from "drizzle-orm";
import {
  type User,
  type InsertUser,
  type ApiKey,
  type InsertApiKey,
  type WhatsappMessage,
  type InsertWhatsappMessage,
  type TwilioCall,
  type InsertTwilioCall,
  type Workflow,
  type InsertWorkflow,
  type CrmContact,
  type InsertCrmContact,
  type SystemLog,
  type InsertSystemLog,
  type ExposedApi,
  type InsertExposedApi,
  type Service,
  type InsertService,
  users,
  apiKeys,
  whatsappMessages,
  twilioCalls,
  workflows,
  crmContacts,
  systemLogs,
  exposedApis,
  services,
} from "@shared/schema";
import { db } from "./db";

export interface IStorage {
  // ===== USERS =====
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // ===== SERVICES =====
  getService(id: string): Promise<Service | undefined>;
  getServicesByUser(userId: string): Promise<Service[]>;
  getServiceByName(userId: string, name: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, updates: Partial<Service>): Promise<Service | undefined>;
  deleteService(id: string): Promise<void>;

  // ===== API KEYS =====
  getApiKey(id: string): Promise<ApiKey | undefined>;
  getApiKeysByUser(userId: string): Promise<ApiKey[]>;
  getApiKeysByService(userId: string, service: string): Promise<ApiKey[]>;
  getApiKeyByService(userId: string, service: string): Promise<ApiKey | undefined>;
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  updateApiKey(id: string, updates: Partial<ApiKey>): Promise<ApiKey | undefined>;
  deleteApiKey(id: string): Promise<void>;

  // ===== WHATSAPP MESSAGES =====
  getWhatsappMessage(id: string): Promise<WhatsappMessage | undefined>;
  getWhatsappMessagesByUser(
    userId: string,
    limit?: number
  ): Promise<WhatsappMessage[]>;
  getWhatsappMessagesByPhone(
    userId: string,
    phoneNumber: string,
    limit?: number
  ): Promise<WhatsappMessage[]>;
  createWhatsappMessage(message: InsertWhatsappMessage): Promise<WhatsappMessage>;
  updateWhatsappMessage(
    id: string,
    updates: Partial<WhatsappMessage>
  ): Promise<WhatsappMessage | undefined>;

  // ===== TWILIO CALLS =====
  getTwilioCall(id: string): Promise<TwilioCall | undefined>;
  getTwilioCallByCallSid(callSid: string): Promise<TwilioCall | undefined>;
  getTwilioCallsByUser(userId: string, limit?: number): Promise<TwilioCall[]>;
  createTwilioCall(call: InsertTwilioCall): Promise<TwilioCall>;
  updateTwilioCall(id: string, updates: Partial<TwilioCall>): Promise<TwilioCall | undefined>;

  // ===== WORKFLOWS =====
  getWorkflow(id: string): Promise<Workflow | undefined>;
  getWorkflowsByUser(userId: string): Promise<Workflow[]>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow | undefined>;
  deleteWorkflow(id: string): Promise<void>;

  // ===== CRM CONTACTS =====
  getCrmContact(id: string): Promise<CrmContact | undefined>;
  getCrmContactsByUser(userId: string, limit?: number): Promise<CrmContact[]>;
  searchCrmContacts(userId: string, query: string): Promise<CrmContact[]>;
  createCrmContact(contact: InsertCrmContact): Promise<CrmContact>;
  updateCrmContact(
    id: string,
    updates: Partial<CrmContact>
  ): Promise<CrmContact | undefined>;

  // ===== SYSTEM LOGS =====
  getSystemLogs(userId: string | null, limit?: number): Promise<SystemLog[]>;
  createSystemLog(log: InsertSystemLog): Promise<SystemLog>;

  // ===== EXPOSED APIS =====
  getExposedApi(id: string): Promise<ExposedApi | undefined>;
  getExposedApisByUser(userId: string): Promise<ExposedApi[]>;
  getExposedApiByEndpoint(endpoint: string): Promise<ExposedApi | undefined>;
  createExposedApi(api: InsertExposedApi): Promise<ExposedApi>;
  updateExposedApi(id: string, updates: Partial<ExposedApi>): Promise<ExposedApi | undefined>;
  deleteExposedApi(id: string): Promise<void>;
}

export class DbStorage implements IStorage {
  // ===== USERS =====
  async getUser(id: string): Promise<User | undefined> {
    return db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return db.query.users.findFirst({
      where: eq(users.username, username),
    });
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return db.query.users.findFirst({
      where: eq(users.googleId, googleId),
    });
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // ===== API KEYS =====
  async getApiKey(id: string): Promise<ApiKey | undefined> {
    return db.query.apiKeys.findFirst({
      where: eq(apiKeys.id, id),
    });
  }

  async getApiKeysByUser(userId: string): Promise<ApiKey[]> {
    return db.query.apiKeys.findMany({
      where: eq(apiKeys.userId, userId),
    });
  }

  async getApiKeyByService(
    userId: string,
    service: string
  ): Promise<ApiKey | undefined> {
    return db.query.apiKeys.findFirst({
      where: and(eq(apiKeys.userId, userId), eq(apiKeys.service, service)),
    });
  }

  async createApiKey(insertApiKey: InsertApiKey): Promise<ApiKey> {
    const [apiKey] = await db.insert(apiKeys).values(insertApiKey).returning();
    return apiKey;
  }

  async updateApiKey(
    id: string,
    updates: Partial<ApiKey>
  ): Promise<ApiKey | undefined> {
    const [updated] = await db
      .update(apiKeys)
      .set(updates)
      .where(eq(apiKeys.id, id))
      .returning();
    return updated;
  }

  async deleteApiKey(id: string): Promise<void> {
    await db.delete(apiKeys).where(eq(apiKeys.id, id));
  }

  async getApiKeysByService(userId: string, service: string): Promise<ApiKey[]> {
    return db.query.apiKeys.findMany({
      where: and(
        eq(apiKeys.userId, userId),
        eq(apiKeys.service, service)
      ),
      orderBy: (ak) => ak.createdAt,
    });
  }

  // ===== SERVICES =====
  async getService(id: string): Promise<Service | undefined> {
    return db.query.services.findFirst({
      where: eq(services.id, id),
    });
  }

  async getServicesByUser(userId: string): Promise<Service[]> {
    return db.query.services.findMany({
      where: eq(services.userId, userId),
      orderBy: (s) => s.createdAt,
    });
  }

  async getServiceByName(userId: string, name: string): Promise<Service | undefined> {
    return db.query.services.findFirst({
      where: and(
        eq(services.userId, userId),
        eq(services.name, name)
      ),
    });
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db
      .insert(services)
      .values(insertService)
      .returning();
    return service;
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service | undefined> {
    const [updated] = await db
      .update(services)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return updated;
  }

  async deleteService(id: string): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // ===== WHATSAPP MESSAGES =====
  async getWhatsappMessage(id: string): Promise<WhatsappMessage | undefined> {
    return db.query.whatsappMessages.findFirst({
      where: eq(whatsappMessages.id, id),
    });
  }

  async getWhatsappMessagesByUser(
    userId: string,
    limit = 50
  ): Promise<WhatsappMessage[]> {
    return db.query.whatsappMessages.findMany({
      where: eq(whatsappMessages.userId, userId),
      limit,
      orderBy: (wm) => wm.createdAt,
    });
  }

  async getWhatsappMessagesByPhone(
    userId: string,
    phoneNumber: string,
    limit = 50
  ): Promise<WhatsappMessage[]> {
    return db.query.whatsappMessages.findMany({
      where: and(
        eq(whatsappMessages.userId, userId),
        eq(whatsappMessages.phoneNumber, phoneNumber)
      ),
      limit,
      orderBy: (wm) => wm.createdAt,
    });
  }

  async createWhatsappMessage(
    insertMsg: InsertWhatsappMessage
  ): Promise<WhatsappMessage> {
    const [msg] = await db
      .insert(whatsappMessages)
      .values(insertMsg)
      .returning();
    return msg;
  }

  async updateWhatsappMessage(
    id: string,
    updates: Partial<WhatsappMessage>
  ): Promise<WhatsappMessage | undefined> {
    const [updated] = await db
      .update(whatsappMessages)
      .set(updates)
      .where(eq(whatsappMessages.id, id))
      .returning();
    return updated;
  }

  // ===== TWILIO CALLS =====
  async getTwilioCall(id: string): Promise<TwilioCall | undefined> {
    return db.query.twilioCalls.findFirst({
      where: eq(twilioCalls.id, id),
    });
  }

  async getTwilioCallByCallSid(callSid: string): Promise<TwilioCall | undefined> {
    return db.query.twilioCalls.findFirst({
      where: eq(twilioCalls.callSid, callSid),
    });
  }

  async getTwilioCallsByUser(userId: string, limit = 50): Promise<TwilioCall[]> {
    return db.query.twilioCalls.findMany({
      where: eq(twilioCalls.userId, userId),
      limit,
      orderBy: (tc) => tc.createdAt,
    });
  }

  async createTwilioCall(insertCall: InsertTwilioCall): Promise<TwilioCall> {
    const [call] = await db
      .insert(twilioCalls)
      .values(insertCall)
      .returning();
    return call;
  }

  async updateTwilioCall(
    id: string,
    updates: Partial<TwilioCall>
  ): Promise<TwilioCall | undefined> {
    const [updated] = await db
      .update(twilioCalls)
      .set(updates)
      .where(eq(twilioCalls.id, id))
      .returning();
    return updated;
  }

  // ===== WORKFLOWS =====
  async getWorkflow(id: string): Promise<Workflow | undefined> {
    return db.query.workflows.findFirst({
      where: eq(workflows.id, id),
    });
  }

  async getWorkflowsByUser(userId: string): Promise<Workflow[]> {
    return db.query.workflows.findMany({
      where: eq(workflows.userId, userId),
      orderBy: (w) => w.createdAt,
    });
  }

  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const [workflow] = await db
      .insert(workflows)
      .values(insertWorkflow)
      .returning();
    return workflow;
  }

  async updateWorkflow(
    id: string,
    updates: Partial<Workflow>
  ): Promise<Workflow | undefined> {
    const [updated] = await db
      .update(workflows)
      .set(updates)
      .where(eq(workflows.id, id))
      .returning();
    return updated;
  }

  async deleteWorkflow(id: string): Promise<void> {
    await db.delete(workflows).where(eq(workflows.id, id));
  }

  // ===== CRM CONTACTS =====
  async getCrmContact(id: string): Promise<CrmContact | undefined> {
    return db.query.crmContacts.findFirst({
      where: eq(crmContacts.id, id),
    });
  }

  async getCrmContactsByUser(
    userId: string,
    limit = 100
  ): Promise<CrmContact[]> {
    return db.query.crmContacts.findMany({
      where: eq(crmContacts.userId, userId),
      limit,
      orderBy: (c) => c.createdAt,
    });
  }

  async searchCrmContacts(userId: string, query: string): Promise<CrmContact[]> {
    return db.query.crmContacts.findMany({
      where: and(
        eq(crmContacts.userId, userId),
      ),
      limit: 20,
    });
  }

  async createCrmContact(insertContact: InsertCrmContact): Promise<CrmContact> {
    const [contact] = await db
      .insert(crmContacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async updateCrmContact(
    id: string,
    updates: Partial<CrmContact>
  ): Promise<CrmContact | undefined> {
    const [updated] = await db
      .update(crmContacts)
      .set(updates)
      .where(eq(crmContacts.id, id))
      .returning();
    return updated;
  }

  // ===== SYSTEM LOGS =====
  async getSystemLogs(
    userId: string | null,
    limit = 100
  ): Promise<SystemLog[]> {
    if (userId) {
      return db.query.systemLogs.findMany({
        where: eq(systemLogs.userId, userId),
        limit,
        orderBy: (sl) => sl.createdAt,
      });
    }
    return db.query.systemLogs.findMany({
      limit,
      orderBy: (sl) => sl.createdAt,
    });
  }

  async createSystemLog(insertLog: InsertSystemLog): Promise<SystemLog> {
    const [log] = await db
      .insert(systemLogs)
      .values(insertLog)
      .returning();
    return log;
  }

  // ===== EXPOSED APIS =====
  async getExposedApi(id: string): Promise<ExposedApi | undefined> {
    return db.query.exposedApis.findFirst({
      where: eq(exposedApis.id, id),
    });
  }

  async getExposedApisByUser(userId: string): Promise<ExposedApi[]> {
    return db.query.exposedApis.findMany({
      where: eq(exposedApis.userId, userId),
      orderBy: (a) => a.createdAt,
    });
  }

  async getExposedApiByEndpoint(endpoint: string): Promise<ExposedApi | undefined> {
    return db.query.exposedApis.findFirst({
      where: eq(exposedApis.endpoint, endpoint),
    });
  }

  async createExposedApi(insertApi: InsertExposedApi): Promise<ExposedApi> {
    const [api] = await db.insert(exposedApis).values(insertApi).returning();
    return api;
  }

  async updateExposedApi(
    id: string,
    updates: Partial<ExposedApi>
  ): Promise<ExposedApi | undefined> {
    const [updated] = await db
      .update(exposedApis)
      .set(updates)
      .where(eq(exposedApis.id, id))
      .returning();
    return updated;
  }

  async deleteExposedApi(id: string): Promise<void> {
    await db.delete(exposedApis).where(eq(exposedApis.id, id));
  }
}

export const storage = new DbStorage();
