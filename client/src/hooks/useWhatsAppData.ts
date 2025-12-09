import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  clientsAPI, campaignsAPI, contactsAPI, 
  whatsappConnectionsAPI, conversationsAPI, messagesAPI 
} from "@/lib/api";
import type { Client, Campaign, Contact, WhatsAppConnection, Conversation, Message } from "@shared/schema";

// ==================== CLIENTS ====================

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: () => clientsAPI.getAll(),
  });
}

export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => clientsAPI.getById(id!),
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Client>) => clientsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) => 
      clientsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

// ==================== WHATSAPP CONNECTIONS ====================

export function useWhatsAppConnections(clientId: string | undefined) {
  return useQuery({
    queryKey: ["whatsapp-connections", clientId],
    queryFn: () => whatsappConnectionsAPI.getByClient(clientId!),
    enabled: !!clientId,
  });
}

export function useCreateWhatsAppConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<WhatsAppConnection>) => whatsappConnectionsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-connections"] });
    },
  });
}

// ==================== CONTACTS ====================

export function useContacts(clientId: string | undefined) {
  return useQuery({
    queryKey: ["contacts", clientId],
    queryFn: () => contactsAPI.getByClient(clientId!),
    enabled: !!clientId,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Contact>) => contactsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contactsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

// ==================== CAMPAIGNS ====================

export function useCampaigns(clientId: string | undefined) {
  return useQuery({
    queryKey: ["campaigns", clientId],
    queryFn: () => campaignsAPI.getByClient(clientId!),
    enabled: !!clientId,
  });
}

export function useCampaign(id: string | undefined) {
  return useQuery({
    queryKey: ["campaigns", id],
    queryFn: () => campaignsAPI.getById(id!),
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Campaign>) => campaignsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Campaign> }) => 
      campaignsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

// ==================== CONVERSATIONS ====================

export function useConversations(clientId: string | undefined) {
  return useQuery({
    queryKey: ["conversations", clientId],
    queryFn: () => conversationsAPI.getByClient(clientId!),
    enabled: !!clientId,
  });
}

export function useConversation(id: string | undefined) {
  return useQuery({
    queryKey: ["conversations", id],
    queryFn: () => conversationsAPI.getById(id!),
    enabled: !!id,
  });
}

// ==================== MESSAGES ====================

export function useMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => messagesAPI.getByConversation(conversationId!),
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { clientId: string; to: string; message: string; type?: string }) => 
      messagesAPI.sendWhatsApp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
