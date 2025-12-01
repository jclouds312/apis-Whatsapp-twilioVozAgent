import type { Request, Response } from "express";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";

export async function registerUser(req: Request, res: Response) {
  try {
    const { username, email, password } = insertUserSchema.parse(req.body);
    
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: "Email already in use" });

    const user = await storage.createUser({ username, email, password, role: "user" });
    res.status(201).json({ user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    res.status(400).json({ error: "Invalid registration data" });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = z.object({ email: z.string().email(), password: z.string() }).parse(req.body);
    
    const user = await storage.getUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    res.status(400).json({ error: "Login failed" });
  }
}

export async function loginWithGoogle(req: Request, res: Response) {
  try {
    const { token, googleId, email, avatar } = req.body;

    let user = await storage.getUserByGoogleId(googleId);
    if (!user) {
      user = await storage.createUser({
        email,
        googleId,
        googleEmail: email,
        avatar,
        username: email.split("@")[0],
        role: "user",
      });
    }

    res.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (error) {
    res.status(400).json({ error: "Google login failed" });
  }
}
