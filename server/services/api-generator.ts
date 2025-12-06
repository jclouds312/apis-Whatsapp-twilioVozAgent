
import crypto from 'crypto';
import { db } from '../storage';
import { apiKeys } from '../../shared/schema';
import { eq } from 'drizzle-orm';

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  expiresAt: Date | null;
  createdAt: Date;
  lastUsed: Date | null;
  usageCount: number;
}

export class APIGeneratorService {
  generateApiKey(): string {
    return `sk_${crypto.randomBytes(32).toString('hex')}`;
  }

  async generateKey(name: string, permissions: string[], expiresIn?: number): Promise<APIKey> {
    const key = this.generateApiKey();
    const hashedKey = crypto.createHash('sha256').update(key).digest('hex');
    
    const expiresAt = expiresIn 
      ? new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000)
      : null;

    const [apiKey] = await db.insert(apiKeys).values({
      name,
      key: hashedKey,
      permissions: JSON.stringify(permissions),
      expiresAt,
      createdAt: new Date(),
      lastUsed: null,
      usageCount: 0,
    }).returning();

    return {
      ...apiKey,
      key, // Return the unhashed key only once
      permissions: JSON.parse(apiKey.permissions as string),
    };
  }

  async listKeys(): Promise<Omit<APIKey, 'key'>[]> {
    const keys = await db.select().from(apiKeys);
    return keys.map(k => ({
      id: k.id,
      name: k.name,
      key: '***************',
      permissions: JSON.parse(k.permissions as string),
      expiresAt: k.expiresAt,
      createdAt: k.createdAt,
      lastUsed: k.lastUsed,
      usageCount: k.usageCount,
    }));
  }

  async revokeKey(keyId: string): Promise<void> {
    await db.delete(apiKeys).where(eq(apiKeys.id, keyId));
  }

  async validateKey(key: string): Promise<boolean> {
    const hashedKey = crypto.createHash('sha256').update(key).digest('hex');
    const [apiKey] = await db.select().from(apiKeys).where(eq(apiKeys.key, hashedKey));

    if (!apiKey) return false;
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return false;

    // Update usage
    await db.update(apiKeys)
      .set({
        lastUsed: new Date(),
        usageCount: apiKey.usageCount + 1,
      })
      .where(eq(apiKeys.id, apiKey.id));

    return true;
  }

  async getKeyUsage(keyId: string) {
    const [apiKey] = await db.select().from(apiKeys).where(eq(apiKeys.id, keyId));
    if (!apiKey) throw new Error('API Key not found');

    return {
      usageCount: apiKey.usageCount,
      lastUsed: apiKey.lastUsed,
      createdAt: apiKey.createdAt,
    };
  }
}
