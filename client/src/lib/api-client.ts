import axios from "axios";

const API_BASE = "/api";

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

export const api = {
  // Auth
  auth: {
    register: (data: any) => apiClient.post("/auth/register", data),
    login: (data: any) => apiClient.post("/auth/login", data),
    loginGoogle: (data: any) => apiClient.post("/auth/google", data),
  },

  // WhatsApp
  whatsapp: {
    getMessages: (userId: string) => apiClient.get(`/whatsapp/messages?userId=${userId}`),
    sendMessage: (data: any) => apiClient.post("/whatsapp/messages", data),
    getTemplates: () => apiClient.get("/whatsapp/templates"),
  },

  // Twilio
  twilio: {
    getCalls: (userId: string) => apiClient.get(`/twilio/calls?userId=${userId}`),
    initiateCall: (data: any) => apiClient.post("/twilio/calls", data),
    getRecordings: (callSid: string) => apiClient.get(`/twilio/calls/${callSid}/recordings`),
  },

  // API Keys
  apiKeys: {
    list: (userId: string) => apiClient.get(`/api-keys?userId=${userId}`),
    create: (data: any) => apiClient.post("/api-keys", data),
    update: (id: string, data: any) => apiClient.put(`/api-keys/${id}`, data),
    delete: (id: string) => apiClient.delete(`/api-keys/${id}`),
  },

  // System
  health: () => apiClient.get("/health"),
  getLogs: () => apiClient.get("/system-logs"),
};
