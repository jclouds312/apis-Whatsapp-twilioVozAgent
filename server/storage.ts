import {
  users,
  services,
  apiKeys,
  whatsappMessages,
  twilioCalls,
  workflows,
  crmContacts,
  systemLogs,
  exposedApis,
  type User,
  type InsertUser,
  type Service,
  type InsertService,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  
  // Services
  getService(id: string): Promise<Service | undefined>;
  getServicesByUserId(userId: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<Service>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;
  
  // API Keys
  getApiKey(id: string): Promise<ApiKey | undefined>;
  getApiKeysByUserId(userId: string): Promise<ApiKey[]>;
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  updateApiKey(id: string, apiKey: Partial<ApiKey>): Promise<ApiKey | undefined>;
  deleteApiKey(id: string): Promise<boolean>;
  
  // WhatsApp Messages
  getWhatsappMessage(id: string): Promise<WhatsappMessage | undefined>;
  getWhatsappMessagesByUserId(userId: string): Promise<WhatsappMessage[]>;
  createWhatsappMessage(message: InsertWhatsappMessage): Promise<WhatsappMessage>;
  
  // Twilio Calls
  getTwilioCall(id: string): Promise<TwilioCall | undefined>;
  getTwilioCallsByUserId(userId: string): Promise<TwilioCall[]>;
  createTwilioCall(call: InsertTwilioCall): Promise<TwilioCall>;
  updateTwilioCall(id: string, call: Partial<TwilioCall>): Promise<TwilioCall | undefined>;
  
  // Workflows
  getWorkflow(id: string): Promise<Workflow | undefined>;
  getWorkflowsByUserId(userId: string): Promise<Workflow[]>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow | undefined>;
  deleteWorkflow(id: string): Promise<boolean>;
  
  // CRM Contacts
  getCrmContact(id: string): Promise<CrmContact | undefined>;
  getCrmContactsByUserId(userId: string): Promise<CrmContact[]>;
  createCrmContact(contact: InsertCrmContact): Promise<CrmContact>;
  updateCrmContact(id: string, contact: Partial<CrmContact>): Promise<CrmContact | undefined>;
  deleteCrmContact(id: string): Promise<boolean>;
  
  // System Logs
  getSystemLogs(limit?: number): Promise<SystemLog[]>;
  createSystemLog(log: InsertSystemLog): Promise<SystemLog>;
  
  // Exposed APIs
  getExposedApi(id: string): Promise<ExposedApi | undefined>;
  getExposedApisByUserId(userId: string): Promise<ExposedApi[]>;
  createExposedApi(api: InsertExposedApi): Promise<ExposedApi>;
  updateExposedApi(id: string, api: Partial<ExposedApi>): Promise<ExposedApi | undefined>;
  deleteExposedApi(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Services
  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async getServicesByUserId(userId: string): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.userId, userId));
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(insertService).returning();
    return service;
  }

  async updateService(id: string, updateData: Partial<Service>): Promise<Service | undefined> {
    const [service] = await db
      .update(services)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return service || undefined;
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // API Keys
  async getApiKey(id: string): Promise<ApiKey | undefined> {
    const [apiKey] = await db.select().from(apiKeys).where(eq(apiKeys.id, id));
    return apiKey || undefined;
  }

  async getApiKeysByUserId(userId: string): Promise<ApiKey[]> {
    return await db.select().from(apiKeys).where(eq(apiKeys.userId, userId));
  }

  async createApiKey(insertApiKey: InsertApiKey): Promise<ApiKey> {
    const [apiKey] = await db.insert(apiKeys).values(insertApiKey).returning();
    return apiKey;
  }

  async updateApiKey(id: string, updateData: Partial<ApiKey>): Promise<ApiKey | undefined> {
    const [apiKey] = await db
      .update(apiKeys)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(apiKeys.id, id))
      .returning();
    return apiKey || undefined;
  }

  async deleteApiKey(id: string): Promise<boolean> {
    const result = await db.delete(apiKeys).where(eq(apiKeys.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // WhatsApp Messages
  async getWhatsappMessage(id: string): Promise<WhatsappMessage | undefined> {
    const [message] = await db.select().from(whatsappMessages).where(eq(whatsappMessages.id, id));
    return message || undefined;
  }

  async getWhatsappMessagesByUserId(userId: string): Promise<WhatsappMessage[]> {
    return await db
      .select()
      .from(whatsappMessages)
      .where(eq(whatsappMessages.userId, userId))
      .orderBy(desc(whatsappMessages.createdAt));
  }

  async createWhatsappMessage(insertMessage: InsertWhatsappMessage): Promise<WhatsappMessage> {
    const [message] = await db.insert(whatsappMessages).values(insertMessage).returning();
    return message;
  }

  // Twilio Calls
  async getTwilioCall(id: string): Promise<TwilioCall | undefined> {
    const [call] = await db.select().from(twilioCalls).where(eq(twilioCalls.id, id));
    return call || undefined;
  }

  async getTwilioCallsByUserId(userId: string): Promise<TwilioCall[]> {
    return await db
      .select()
      .from(twilioCalls)
      .where(eq(twilioCalls.userId, userId))
      .orderBy(desc(twilioCalls.createdAt));
  }

  async createTwilioCall(insertCall: InsertTwilioCall): Promise<TwilioCall> {
    const [call] = await db.insert(twilioCalls).values(insertCall).returning();
    return call;
  }

  async updateTwilioCall(id: string, updateData: Partial<TwilioCall>): Promise<TwilioCall | undefined> {
    const [call] = await db
      .update(twilioCalls)
      .set(updateData)
      .where(eq(twilioCalls.id, id))
      .returning();
    return call || undefined;
  }

  // Workflows
  async getWorkflow(id: string): Promise<Workflow | undefined> {
    const [workflow] = await db.select().from(workflows).where(eq(workflows.id, id));
    return workflow || undefined;
  }

  async getWorkflowsByUserId(userId: string): Promise<Workflow[]> {
    return await db.select().from(workflows).where(eq(workflows.userId, userId));
  }

  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const [workflow] = await db.insert(workflows).values(insertWorkflow).returning();
    return workflow;
  }

  async updateWorkflow(id: string, updateData: Partial<Workflow>): Promise<Workflow | undefined> {
    const [workflow] = await db
      .update(workflows)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(workflows.id, id))
      .returning();
    return workflow || undefined;
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    const result = await db.delete(workflows).where(eq(workflows.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // CRM Contacts
  async getCrmContact(id: string): Promise<CrmContact | undefined> {
    const [contact] = await db.select().from(crmContacts).where(eq(crmContacts.id, id));
    return contact || undefined;
  }

  async getCrmContactsByUserId(userId: string): Promise<CrmContact[]> {
    return await db
      .select()
      .from(crmContacts)
      .where(eq(crmContacts.userId, userId))
      .orderBy(desc(crmContacts.createdAt));
  }

  async createCrmContact(insertContact: InsertCrmContact): Promise<CrmContact> {
    const [contact] = await db.insert(crmContacts).values(insertContact).returning();
    return contact;
  }

  async updateCrmContact(id: string, updateData: Partial<CrmContact>): Promise<CrmContact | undefined> {
    const [contact] = await db
      .update(crmContacts)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(crmContacts.id, id))
      .returning();
    return contact || undefined;
  }

  async deleteCrmContact(id: string): Promise<boolean> {
    const result = await db.delete(crmContacts).where(eq(crmContacts.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // System Logs
  async getSystemLogs(limit: number = 100): Promise<SystemLog[]> {
    return await db
      .select()
      .from(systemLogs)
      .orderBy(desc(systemLogs.createdAt))
      .limit(limit);
  }

  async createSystemLog(insertLog: InsertSystemLog): Promise<SystemLog> {
    const [log] = await db.insert(systemLogs).values(insertLog).returning();
    return log;
  }

  // Exposed APIs
  async getExposedApi(id: string): Promise<ExposedApi | undefined> {
    const [api] = await db.select().from(exposedApis).where(eq(exposedApis.id, id));
    return api || undefined;
  }

  async getExposedApisByUserId(userId: string): Promise<ExposedApi[]> {
    return await db.select().from(exposedApis).where(eq(exposedApis.userId, userId));
  }

  async createExposedApi(insertApi: InsertExposedApi): Promise<ExposedApi> {
    const [api] = await db.insert(exposedApis).values(insertApi).returning();
    return api;
  }

  async updateExposedApi(id: string, updateData: Partial<ExposedApi>): Promise<ExposedApi | undefined> {
    const [api] = await db
      .update(exposedApis)
      .set(updateData)
      .where(eq(exposedApis.id, id))
      .returning();
    return api || undefined;
  }

  async deleteExposedApi(id: string): Promise<boolean> {
    const result = await db.delete(exposedApis).where(eq(exposedApis.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const storage = new DatabaseStorage();
