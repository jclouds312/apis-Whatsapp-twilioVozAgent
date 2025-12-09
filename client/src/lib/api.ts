import type { Client, Campaign, Contact, WhatsAppConnection, Message, Conversation } from "@shared/schema";

const API_BASE = "/api";

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ==================== CLIENTS ====================

export const clientsAPI = {
  getAll: () => fetchAPI<Client[]>("/clients"),
  getById: (id: string) => fetchAPI<Client>(`/clients/${id}`),
  create: (data: Partial<Client>) => fetchAPI<Client>("/clients", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<Client>) => fetchAPI<Client>(`/clients/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI<{ success: boolean }>(`/clients/${id}`, {
    method: "DELETE",
  }),
};

// ==================== WHATSAPP CONNECTIONS ====================

export const whatsappConnectionsAPI = {
  getByClient: (clientId: string) => fetchAPI<WhatsAppConnection[]>(`/clients/${clientId}/whatsapp-connections`),
  create: (data: Partial<WhatsAppConnection>) => fetchAPI<WhatsAppConnection>("/whatsapp-connections", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<WhatsAppConnection>) => fetchAPI<WhatsAppConnection>(`/whatsapp-connections/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  }),
};

// ==================== CONTACTS ====================

export const contactsAPI = {
  getByClient: (clientId: string) => fetchAPI<Contact[]>(`/clients/${clientId}/contacts`),
  create: (data: Partial<Contact>) => fetchAPI<Contact>("/contacts", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<Contact>) => fetchAPI<Contact>(`/contacts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI<{ success: boolean }>(`/contacts/${id}`, {
    method: "DELETE",
  }),
};

// ==================== CAMPAIGNS ====================

export const campaignsAPI = {
  getByClient: (clientId: string) => fetchAPI<Campaign[]>(`/clients/${clientId}/campaigns`),
  getById: (id: string) => fetchAPI<Campaign>(`/campaigns/${id}`),
  create: (data: Partial<Campaign>) => fetchAPI<Campaign>("/campaigns", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<Campaign>) => fetchAPI<Campaign>(`/campaigns/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI<{ success: boolean }>(`/campaigns/${id}`, {
    method: "DELETE",
  }),
};

// ==================== CONVERSATIONS ====================

export const conversationsAPI = {
  getByClient: (clientId: string) => fetchAPI<Conversation[]>(`/clients/${clientId}/conversations`),
  getById: (id: string) => fetchAPI<Conversation>(`/conversations/${id}`),
  create: (data: Partial<Conversation>) => fetchAPI<Conversation>("/conversations", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<Conversation>) => fetchAPI<Conversation>(`/conversations/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  }),
};

// ==================== MESSAGES ====================

export const messagesAPI = {
  getByConversation: (conversationId: string) => fetchAPI<Message[]>(`/conversations/${conversationId}/messages`),
  create: (data: Partial<Message>) => fetchAPI<Message>("/messages", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  sendWhatsApp: (data: { clientId: string; to: string; message: string; type?: string }) => 
    fetchAPI<Message>("/whatsapp/send-message", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
