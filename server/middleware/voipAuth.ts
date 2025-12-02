
import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

export async function voipAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Missing or invalid authorization header'
      });
    }

    const apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Validate API key
    const key = await storage.getApiKeyByKey(apiKey);

    if (!key) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key'
      });
    }

    if (!key.isActive) {
      return res.status(403).json({
        success: false,
        error: 'API key is inactive'
      });
    }

    // Attach user info to request
    (req as any).userId = key.userId;
    (req as any).apiKey = key;

    // Update last used timestamp
    await storage.updateApiKey(key.id, {
      lastUsed: new Date()
    });

    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Authentication failed: ' + error.message
    });
  }
}
