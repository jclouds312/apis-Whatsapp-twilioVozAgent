import { sql, timestamp, integer } from "drizzle-orm";
import { pgTable, text, varchar, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import crypto from "crypto";

export const users = pgTable("users", {
  id: serial('id').primaryKey(),
  username: text('username').unique().notNull(),
  password: text('password').notNull(),
});

export const apiKeys = pgTable('api_keys', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  key: text('key').notNull().unique(),
  permissions: text('permissions').notNull(),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').notNull(),
  lastUsed: timestamp('last_used'),
  usageCount: integer('usage_count').notNull().default(0),
});


export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;