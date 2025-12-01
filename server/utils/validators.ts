import { z } from "zod";

export const phoneNumberSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format");
export const emailSchema = z.string().email("Invalid email format");
export const urlSchema = z.string().url("Invalid URL format");
export const apiKeySchema = z.string().min(16, "API key too short");

export function validatePhoneNumber(phone: string): boolean {
  return phoneNumberSchema.safeParse(phone).success;
}

export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) return "+1" + cleaned;
  if (cleaned.length === 11 && cleaned[0] === "1") return "+" + cleaned;
  return "+" + cleaned;
}

export function maskSensitiveData(value: string, visible = 4): string {
  if (value.length <= visible) return value;
  return value.substring(0, visible) + "•".repeat(value.length - visible);
}
