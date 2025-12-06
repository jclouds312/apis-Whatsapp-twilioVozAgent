import { sql } from "drizzle-orm";
import { pgTable, text, serial, timestamp, boolean, integer, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users (authentication)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Contacts / CRM
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  status: text("status").notNull().default("active"),
  lastContactedAt: timestamp("last_contacted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// Messages (WhatsApp, SMS)
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  direction: text("direction").notNull(),
  from: text("from").notNull(),
  to: text("to").notNull(),
  body: text("body").notNull(),
  status: text("status").notNull(),
  twilioSid: text("twilio_sid"),
  contactId: integer("contact_id").references(() => contacts.id),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Voice Calls
export const calls = pgTable("calls", {
  id: serial("id").primaryKey(),
  direction: text("direction").notNull(),
  from: text("from").notNull(),
  to: text("to").notNull(),
  duration: integer("duration"),
  status: text("status").notNull(),
  twilioSid: text("twilio_sid"),
  recordingUrl: text("recording_url"),
  transcription: text("transcription"),
  contactId: integer("contact_id").references(() => contacts.id),
  metadata: jsonb("metadata"),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCallSchema = createInsertSchema(calls).omit({
  id: true,
  createdAt: true,
});
export type InsertCall = z.infer<typeof insertCallSchema>;
export type Call = typeof calls.$inferSelect;

// Workflows
export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"),
  trigger: text("trigger").notNull(),
  flowData: jsonb("flow_data").notNull(),
  stepCount: integer("step_count").default(0),
  lastRunAt: timestamp("last_run_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWorkflowSchema = createInsertSchema(workflows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type Workflow = typeof workflows.$inferSelect;

// Knowledge Base Documents
export const knowledgeDocuments = pgTable("knowledge_documents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  content: text("content"),
  url: text("url"),
  size: integer("size"),
  status: text("status").notNull().default("processing"),
  vectorCount: integer("vector_count").default(0),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertKnowledgeDocumentSchema = createInsertSchema(knowledgeDocuments).omit({
  id: true,
  createdAt: true,
});
export type InsertKnowledgeDocument = z.infer<typeof insertKnowledgeDocumentSchema>;
export type KnowledgeDocument = typeof knowledgeDocuments.$inferSelect;

// Agent Sessions (for tracking live conversations)
export const agentSessions = pgTable("agent_sessions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  contactId: integer("contact_id").references(() => contacts.id),
  callId: integer("call_id").references(() => calls.id),
  status: text("status").notNull(),
  transcript: jsonb("transcript"),
  sentiment: text("sentiment"),
  intents: text("intents").array(),
  metadata: jsonb("metadata"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
});

export const insertAgentSessionSchema = createInsertSchema(agentSessions).omit({
  id: true,
  startedAt: true,
});
export type InsertAgentSession = z.infer<typeof insertAgentSessionSchema>;
export type AgentSession = typeof agentSessions.$inferSelect;
