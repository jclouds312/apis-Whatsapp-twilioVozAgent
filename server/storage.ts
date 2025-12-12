import { eq, desc, and } from "drizzle-orm";
import { db } from "./db";
import {
  users, services, apiKeys, whatsappMessages, twilioCalls,
  workflows, crmContacts, systemLogs, voipExtensions, exposedApis,
  type User, type InsertUser,
  type Service, type InsertService,
  type ApiKey, type InsertApiKey,
  type WhatsappMessage, type InsertWhatsappMessage,
  type TwilioCall, type InsertTwilioCall,
  type Workflow, type InsertWorkflow,
  type CrmContact, type InsertCrmContact,
  type SystemLog, type InsertSystemLog,
  type VoipExtension, type InsertVoipExtension,
  type ExposedApi, type InsertExposedApi,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  
  // Services
  getServices(userId: string): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, data: Partial<InsertService>): Promise<Service | undefined>;
  
  // API Keys
  getApiKeys(userId: string): Promise<ApiKey[]>;
  getApiKey(id: string): Promise<ApiKey | undefined>;
  getApiKeyByKey(key: string): Promise<ApiKey | undefined>;
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  updateApiKey(id: string, data: Partial<InsertApiKey>): Promise<ApiKey | undefined>;
  deleteApiKey(id: string): Promise<boolean>;
  getAllApiKeys(): Promise<ApiKey[]>;
  
  // WhatsApp Messages
  getWhatsappMessages(userId: string): Promise<WhatsappMessage[]>;
  createWhatsappMessage(message: InsertWhatsappMessage): Promise<WhatsappMessage>;
  updateWhatsappMessageStatus(id: string, status: string): Promise<WhatsappMessage | undefined>;
  
  // Twilio Calls
  getTwilioCalls(userId: string): Promise<TwilioCall[]>;
  getTwilioCallBySid(callSid: string): Promise<TwilioCall | undefined>;
  createTwilioCall(call: InsertTwilioCall): Promise<TwilioCall>;
  updateTwilioCall(id: string, data: Partial<InsertTwilioCall>): Promise<TwilioCall | undefined>;
  
  // Workflows
  getWorkflows(userId: string): Promise<Workflow[]>;
  getWorkflow(id: string): Promise<Workflow | undefined>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: string, data: Partial<InsertWorkflow>): Promise<Workflow | undefined>;
  deleteWorkflow(id: string): Promise<boolean>;
  
  // CRM Contacts
  getCrmContacts(userId: string): Promise<CrmContact[]>;
  getCrmContact(id: string): Promise<CrmContact | undefined>;
  createCrmContact(contact: InsertCrmContact): Promise<CrmContact>;
  updateCrmContact(id: string, data: Partial<InsertCrmContact>): Promise<CrmContact | undefined>;
  deleteCrmContact(id: string): Promise<boolean>;
  
  // System Logs
  getSystemLogs(userId?: string, limit?: number): Promise<SystemLog[]>;
  createSystemLog(log: InsertSystemLog): Promise<SystemLog>;
  
  // VoIP Extensions
  getVoipExtensions(userId: string): Promise<VoipExtension[]>;
  getVoipExtension(id: string): Promise<VoipExtension | undefined>;
  createVoipExtension(extension: InsertVoipExtension): Promise<VoipExtension>;
  updateVoipExtension(id: string, data: Partial<InsertVoipExtension>): Promise<VoipExtension | undefined>;
  deleteVoipExtension(id: string): Promise<boolean>;
  
  // Exposed APIs
  getExposedApis(userId: string): Promise<ExposedApi[]>;
  getExposedApi(id: string): Promise<ExposedApi | undefined>;
  createExposedApi(api: InsertExposedApi): Promise<ExposedApi>;
  updateExposedApi(id: string, data: Partial<InsertExposedApi>): Promise<ExposedApi | undefined>;
  deleteExposedApi(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // ============= USERS =============
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // ============= SERVICES =============
  async getServices(userId: string): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.userId, userId));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: string, data: Partial<InsertService>): Promise<Service | undefined> {
    const [updated] = await db.update(services).set({ ...data, updatedAt: new Date() }).where(eq(services.id, id)).returning();
    return updated;
  }

  // ============= API KEYS =============
  async getApiKeys(userId: string): Promise<ApiKey[]> {
    return await db.select().from(apiKeys).where(eq(apiKeys.userId, userId)).orderBy(desc(apiKeys.createdAt));
  }

  async getAllApiKeys(): Promise<ApiKey[]> {
    return await db.select().from(apiKeys).orderBy(desc(apiKeys.createdAt));
  }

  async getApiKey(id: string): Promise<ApiKey | undefined> {
    const [apiKey] = await db.select().from(apiKeys).where(eq(apiKeys.id, id));
    return apiKey;
  }

  async getApiKeyByKey(key: string): Promise<ApiKey | undefined> {
    const [apiKey] = await db.select().from(apiKeys).where(eq(apiKeys.key, key));
    return apiKey;
  }

  async createApiKey(apiKey: InsertApiKey): Promise<ApiKey> {
    const [newApiKey] = await db.insert(apiKeys).values(apiKey).returning();
    return newApiKey;
  }

  async updateApiKey(id: string, data: Partial<InsertApiKey>): Promise<ApiKey | undefined> {
    const [updated] = await db.update(apiKeys).set({ ...data, updatedAt: new Date() }).where(eq(apiKeys.id, id)).returning();
    return updated;
  }

  async deleteApiKey(id: string): Promise<boolean> {
    const result = await db.delete(apiKeys).where(eq(apiKeys.id, id));
    return true;
  }

  // ============= WHATSAPP MESSAGES =============
  async getWhatsappMessages(userId: string): Promise<WhatsappMessage[]> {
    return await db.select().from(whatsappMessages).where(eq(whatsappMessages.userId, userId)).orderBy(desc(whatsappMessages.createdAt));
  }

  async createWhatsappMessage(message: InsertWhatsappMessage): Promise<WhatsappMessage> {
    const [newMessage] = await db.insert(whatsappMessages).values(message).returning();
    return newMessage;
  }

  async updateWhatsappMessageStatus(id: string, status: string): Promise<WhatsappMessage | undefined> {
    const [updated] = await db.update(whatsappMessages).set({ status }).where(eq(whatsappMessages.id, id)).returning();
    return updated;
  }

  // ============= TWILIO CALLS =============
  async getTwilioCalls(userId: string): Promise<TwilioCall[]> {
    return await db.select().from(twilioCalls).where(eq(twilioCalls.userId, userId)).orderBy(desc(twilioCalls.createdAt));
  }

  async getTwilioCallBySid(callSid: string): Promise<TwilioCall | undefined> {
    const [call] = await db.select().from(twilioCalls).where(eq(twilioCalls.callSid, callSid));
    return call;
  }

  async createTwilioCall(call: InsertTwilioCall): Promise<TwilioCall> {
    const [newCall] = await db.insert(twilioCalls).values(call).returning();
    return newCall;
  }

  async updateTwilioCall(id: string, data: Partial<InsertTwilioCall>): Promise<TwilioCall | undefined> {
    const [updated] = await db.update(twilioCalls).set(data).where(eq(twilioCalls.id, id)).returning();
    return updated;
  }

  // ============= WORKFLOWS =============
  async getWorkflows(userId: string): Promise<Workflow[]> {
    return await db.select().from(workflows).where(eq(workflows.userId, userId)).orderBy(desc(workflows.createdAt));
  }

  async getWorkflow(id: string): Promise<Workflow | undefined> {
    const [workflow] = await db.select().from(workflows).where(eq(workflows.id, id));
    return workflow;
  }

  async createWorkflow(workflow: InsertWorkflow): Promise<Workflow> {
    const [newWorkflow] = await db.insert(workflows).values(workflow).returning();
    return newWorkflow;
  }

  async updateWorkflow(id: string, data: Partial<InsertWorkflow>): Promise<Workflow | undefined> {
    const [updated] = await db.update(workflows).set({ ...data, updatedAt: new Date() }).where(eq(workflows.id, id)).returning();
    return updated;
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    await db.delete(workflows).where(eq(workflows.id, id));
    return true;
  }

  // ============= CRM CONTACTS =============
  async getCrmContacts(userId: string): Promise<CrmContact[]> {
    return await db.select().from(crmContacts).where(eq(crmContacts.userId, userId)).orderBy(desc(crmContacts.createdAt));
  }

  async getCrmContact(id: string): Promise<CrmContact | undefined> {
    const [contact] = await db.select().from(crmContacts).where(eq(crmContacts.id, id));
    return contact;
  }

  async createCrmContact(contact: InsertCrmContact): Promise<CrmContact> {
    const [newContact] = await db.insert(crmContacts).values(contact).returning();
    return newContact;
  }

  async updateCrmContact(id: string, data: Partial<InsertCrmContact>): Promise<CrmContact | undefined> {
    const [updated] = await db.update(crmContacts).set({ ...data, updatedAt: new Date() }).where(eq(crmContacts.id, id)).returning();
    return updated;
  }

  async deleteCrmContact(id: string): Promise<boolean> {
    await db.delete(crmContacts).where(eq(crmContacts.id, id));
    return true;
  }

  // ============= SYSTEM LOGS =============
  async getSystemLogs(userId?: string, limit: number = 100): Promise<SystemLog[]> {
    if (userId) {
      return await db.select().from(systemLogs).where(eq(systemLogs.userId, userId)).orderBy(desc(systemLogs.createdAt)).limit(limit);
    }
    return await db.select().from(systemLogs).orderBy(desc(systemLogs.createdAt)).limit(limit);
  }

  async createSystemLog(log: InsertSystemLog): Promise<SystemLog> {
    const [newLog] = await db.insert(systemLogs).values(log).returning();
    return newLog;
  }

  // ============= VOIP EXTENSIONS =============
  async getVoipExtensions(userId: string): Promise<VoipExtension[]> {
    return await db.select().from(voipExtensions).where(eq(voipExtensions.userId, userId)).orderBy(desc(voipExtensions.createdAt));
  }

  async getVoipExtension(id: string): Promise<VoipExtension | undefined> {
    const [extension] = await db.select().from(voipExtensions).where(eq(voipExtensions.id, id));
    return extension;
  }

  async createVoipExtension(extension: InsertVoipExtension): Promise<VoipExtension> {
    const [newExtension] = await db.insert(voipExtensions).values(extension).returning();
    return newExtension;
  }

  async updateVoipExtension(id: string, data: Partial<InsertVoipExtension>): Promise<VoipExtension | undefined> {
    const [updated] = await db.update(voipExtensions).set({ ...data, updatedAt: new Date() }).where(eq(voipExtensions.id, id)).returning();
    return updated;
  }

  async deleteVoipExtension(id: string): Promise<boolean> {
    await db.delete(voipExtensions).where(eq(voipExtensions.id, id));
    return true;
  }

  // ============= EXPOSED APIS =============
  async getExposedApis(userId: string): Promise<ExposedApi[]> {
    return await db.select().from(exposedApis).where(eq(exposedApis.userId, userId)).orderBy(desc(exposedApis.createdAt));
  }

  async getExposedApi(id: string): Promise<ExposedApi | undefined> {
    const [api] = await db.select().from(exposedApis).where(eq(exposedApis.id, id));
    return api;
  }

  async createExposedApi(api: InsertExposedApi): Promise<ExposedApi> {
    const [newApi] = await db.insert(exposedApis).values(api).returning();
    return newApi;
  }

  async updateExposedApi(id: string, data: Partial<InsertExposedApi>): Promise<ExposedApi | undefined> {
    const [updated] = await db.update(exposedApis).set(data).where(eq(exposedApis.id, id)).returning();
    return updated;
  }

  async deleteExposedApi(id: string): Promise<boolean> {
    await db.delete(exposedApis).where(eq(exposedApis.id, id));
    return true;
  }
}

export const storage = new DatabaseStorage();
