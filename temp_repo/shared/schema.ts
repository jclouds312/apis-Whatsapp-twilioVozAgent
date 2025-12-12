import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============= USERS =============
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password"),
  email: text("email").notNull().unique(),
  googleId: text("google_id"),
  googleEmail: text("google_email"),
  avatar: text("avatar"),
  role: text("role").default("user"), // 'admin', 'user'
  isActive: boolean("is_active").default(true),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ============= SERVICES =============
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(), // 'twilio', 'whatsapp', 'crm'
  status: text("status").default("disconnected"), // 'connected', 'disconnected', 'error'
  credentials: jsonb("credentials").default({}), // Encrypted credentials
  config: jsonb("config").default({}), // Service config
  isActive: boolean("is_active").default(true),
  lastSyncedAt: timestamp("last_synced_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertServicesSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertService = z.infer<typeof insertServicesSchema>;
export type Service = typeof services.$inferSelect;

// ============= API KEYS =============
export const apiKeys = pgTable("api_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  serviceId: varchar("service_id"), // Link to service
  service: text("service").notNull(), // 'whatsapp', 'twilio', 'evolution'
  name: text("name"), // Custom name for the key
  key: text("key").notNull(),
  secret: text("secret"),
  webhookUrl: text("webhook_url"),
  isActive: boolean("is_active").default(true),
  usageCount: text("usage_count").default("0"), // JSON string for daily counts
  totalRequests: text("total_requests").default("0"),
  lastUsed: timestamp("last_used"),
  metadata: jsonb("metadata").default({}), // Store usage stats and info
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertApiKeySchema = createInsertSchema(apiKeys).omit({
  id: true,
  createdAt: true,
  lastUsed: true,
});

export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type ApiKey = typeof apiKeys.$inferSelect;

// ============= WHATSAPP MESSAGES =============
export const whatsappMessages = pgTable("whatsapp_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  phoneNumber: text("phone_number").notNull(),
  recipientPhone: text("recipient_phone").notNull(),
  message: text("message").notNull(),
  mediaUrl: text("media_url"),
  status: text("status").default("pending"), // 'pending', 'sent', 'delivered', 'failed'
  direction: text("direction").default("outbound"), // 'inbound', 'outbound'
  externalId: text("external_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWhatsappMessageSchema = createInsertSchema(
  whatsappMessages
).omit({
  id: true,
  createdAt: true,
});

export type InsertWhatsappMessage = z.infer<typeof insertWhatsappMessageSchema>;
export type WhatsappMessage = typeof whatsappMessages.$inferSelect;

// ============= TWILIO CALLS =============
export const twilioCalls = pgTable("twilio_calls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  callSid: text("call_sid").notNull().unique(),
  fromNumber: text("from_number").notNull(),
  toNumber: text("to_number").notNull(),
  status: text("status").default("initiated"), // 'initiated', 'ringing', 'in-progress', 'completed', 'failed'
  duration: text("duration"),
  recordingUrl: text("recording_url"),
  direction: text("direction").default("outbound"), // 'inbound', 'outbound'
  createdAt: timestamp("created_at").defaultNow(),
  endedAt: timestamp("ended_at"),
});

export const insertTwilioCallSchema = createInsertSchema(twilioCalls).omit({
  id: true,
  createdAt: true,
  endedAt: true,
});

export type InsertTwilioCall = z.infer<typeof insertTwilioCallSchema>;
export type TwilioCall = typeof twilioCalls.$inferSelect;

// ============= WORKFLOWS =============
export const workflows = pgTable("workflows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  trigger: text("trigger").notNull(), // 'whatsapp_message', 'twilio_call', 'cron'
  actions: jsonb("actions").default([]), // Array of workflow actions
  isActive: boolean("is_active").default(true),
  executionCount: text("execution_count").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWorkflowSchema = createInsertSchema(workflows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  executionCount: true,
});

export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type Workflow = typeof workflows.$inferSelect;

// ============= CRM CONTACTS =============
export const crmContacts = pgTable("crm_contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  status: text("status").default("new"), // 'new', 'contacted', 'qualified', 'converted'
  customData: jsonb("custom_data").default({}),
  source: text("source"), // 'whatsapp', 'twilio', 'manual'
  lastContactedAt: timestamp("last_contacted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCrmContactSchema = createInsertSchema(crmContacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCrmContact = z.infer<typeof insertCrmContactSchema>;
export type CrmContact = typeof crmContacts.$inferSelect;

// ============= SYSTEM LOGS =============
export const systemLogs = pgTable("system_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  eventType: text("event_type").notNull(), // 'message_sent', 'call_initiated', 'webhook_received'
  service: text("service"), // 'whatsapp', 'twilio', 'evolution'
  message: text("message"),
  status: text("status").default("info"), // 'info', 'warning', 'error', 'success'
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSystemLogSchema = createInsertSchema(systemLogs).omit({
  id: true,
  createdAt: true,
  });

export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;
export type SystemLog = typeof systemLogs.$inferSelect;

// ============= VOIP EXTENSIONS =============
export const voipExtensions = pgTable("voip_extensions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  extensionNumber: text("extension_number").notNull().unique(),
  name: text("name").notNull(),
  phoneNumber: text("phone_number"), // Número de teléfono vinculado
  role: text("role").default("user"), // 'admin', 'user', 'supervisor'
  status: text("status").default("available"), // 'available', 'busy', 'offline'
  credentials: jsonb("credentials").default({}),
  permissions: jsonb("permissions").default({}),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertVoipExtensionSchema = createInsertSchema(voipExtensions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertVoipExtension = z.infer<typeof insertVoipExtensionSchema>;
export type VoipExtension = typeof voipExtensions.$inferSelect;

// ============= EXPOSED API ENDPOINTS =============
export const exposedApis = pgTable("exposed_apis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  endpoint: text("endpoint").notNull().unique(),
  method: text("method").default("POST"), // 'GET', 'POST', 'PUT', 'DELETE'
  config: jsonb("config").default({}), // API configuration
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertExposedApiSchema = createInsertSchema(exposedApis).omit({
  id: true,
  createdAt: true,
});

export type InsertExposedApi = z.infer<typeof insertExposedApiSchema>;
export type ExposedApi = typeof exposedApis.$inferSelect;
