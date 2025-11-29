import type { ApiKey, Log, User, Workflow, ExposedApi, Conversation } from '@/lib/types';

export const userAvatar = "https://picsum.photos/seed/user1/100/100";

export const apiKeys: ApiKey[] = [
  { id: 'key_waba_1', service: 'WhatsApp Business', key: 'WA-xxxx-xxxx-xxxx-E7G8', status: 'active', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() },
  { id: 'key_tw_1', service: 'Twilio', key: 'TW-xxxx-xxxx-xxxx-F9H1', status: 'active', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString() },
  { id: 'key_crm_1', service: 'CRM Hubspot', key: 'CRM-xxxx-xxxx-xxxx-A1B2', status: 'active', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString() },
  { id: 'key_waba_2', service: 'WhatsApp Business', key: 'WA-xxxx_xxxx-xxxx-C3D4', status: 'revoked', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString() },
];

export const logs: Log[] = [
  { id: 'log_1', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), level: 'info', service: 'Function Connect', message: 'Workflow "New Lead from WA" triggered successfully.' },
  { id: 'log_2', timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(), level: 'info', service: 'CRM Connector', message: 'Successfully created contact in CRM for +1...2345.' },
  { id: 'log_3', timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(), level: 'warn', service: 'Twilio', message: 'Voice call to +1...5678 failed: No answer.' },
  { id: 'log_4', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), level: 'error', service: 'API Exhibition', message: 'Endpoint /v1/products returned 500 Internal Server Error.' },
  { id: 'log_5', timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(), level: 'info', service: 'WhatsApp', message: 'Sent template `order_confirmation` to +1...9012.' },
  { id: 'log_6', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), level: 'info', service: 'Function Connect', message: 'Workflow "Support Ticket from Twilio" triggered.' },
  { id: 'log_7', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), level: 'error', service: 'CRM Connector', message: 'Failed to update deal: Invalid ID `deal_abc`.' },
];

export const users: User[] = [
  { id: 'usr_1', name: 'Admin User', email: 'admin@apimanager.io', role: 'Admin', avatarUrl: userAvatar },
  { id: 'usr_2', name: 'John Agent', email: 'john.agent@apimanager.io', role: 'Agent', avatarUrl: 'https://picsum.photos/seed/user2/100/100' },
  { id: 'usr_3', name: 'Sarah Developer', email: 'sarah.dev@apimanager.io', role: 'Developer', avatarUrl: 'https://picsum.photos/seed/user3/100/100' },
  { id: 'usr_4', name: 'Mike Manager', email: 'mike.manager@apimanager.io', role: 'Manager', avatarUrl: 'https://picsum.photos/seed/user4/100/100' },
];

export const workflows: Workflow[] = [
    {
        id: 'wf_1',
        name: 'New Lead from WhatsApp',
        trigger: {
            service: 'WhatsApp',
            event: 'Inbound Message',
        },
        steps: [
            { name: 'Transform Data', description: 'Map WA message to CRM lead format.' },
            { name: 'Create CRM Lead', description: 'API call to POST /v1/leads.' },
            { name: 'Send Confirmation', description: 'Send `lead_received` template via WhatsApp.' },
        ],
        status: 'active',
        lastRun: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
        id: 'wf_2',
        name: 'Support Ticket from Twilio Call',
        trigger: {
            service: 'Twilio',
            event: 'Inbound Call (Voicemail)',
        },
        steps: [
            { name: 'Transcribe Voicemail', description: 'Use Twilio transcription.' },
            { name: 'Create CRM Ticket', description: 'API call to POST /v1/tickets.' },
            { name: 'Notify Agent', description: 'Send internal notification.' },
        ],
        status: 'active',
        lastRun: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
        id: 'wf_3',
        name: 'CRM Update to WhatsApp',
        trigger: {
            service: 'CRM',
            event: 'Deal Stage Changed',
        },
        steps: [
            { name: 'Filter for "Won"', description: 'Conditional rule: stage = Won.' },
            { name: 'Send Thank You Message', description: 'Send `deal_won` template via WhatsApp.' },
        ],
        status: 'inactive',
        lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    }
];

export const exposedApis: ExposedApi[] = [
    { id: 'api_1', name: 'Get Products', description: 'Retrieves a list of all available products.', status: 'published', method: 'GET', endpoint: '/v1/products', version: '1.0.0' },
    { id: 'api_2', name: 'Create Order', description: 'Creates a new customer order.', status: 'published', method: 'POST', endpoint: '/v1/orders', version: '1.0.0' },
    { id: 'api_3', name: 'Get User Profile', description: 'Fetches profile for a given user ID.', status: 'draft', method: 'GET', endpoint: '/v2/users/{userId}', version: '2.0.0-beta' },
    { id: 'api_4', name: 'Update Inventory', description: 'Updates stock levels for a product.', status: 'deprecated', method: 'PUT', endpoint: '/v1/inventory', version: '1.0.0' },
];

export const conversations: Conversation[] = [
    {
        id: 'conv_1',
        contactName: 'John Agent',
        contactAvatar: users.find(u => u.id === 'usr_2')?.avatarUrl || '',
        lastMessage: 'Sure, I can do that. When do you need it by?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        messages: [
            { id: 'msg_1_1', contactId: 'usr_2', content: 'Hey, I have a question about my last order.', timestamp: new Date(Date.now() - 1000 * 60 * 2.5).toISOString(), isSender: false },
            { id: 'msg_1_2', contactId: 'usr_1', content: 'Sure, I can do that. When do you need it by?', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), isSender: true },
        ],
    },
    {
        id: 'conv_2',
        contactName: 'Sarah Developer',
        contactAvatar: users.find(u => u.id === 'usr_3')?.avatarUrl || '',
        lastMessage: 'Got it, thanks!',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        messages: [
            { id: 'msg_2_1', contactId: 'usr_1', content: 'Here is the report you requested.', timestamp: new Date(Date.now() - 1000 * 60 * 30.5).toISOString(), isSender: true },
            { id: 'msg_2_2', contactId: 'usr_3', content: 'Got it, thanks!', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), isSender: false },
        ],
    },
    {
        id: 'conv_3',
        contactName: 'Mike Manager',
        contactAvatar: users.find(u => u.id === 'usr_4')?.avatarUrl || '',
        lastMessage: 'See you then!',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        messages: [
             { id: 'msg_3_1', contactId: 'usr_4', content: 'Meeting at 3 PM tomorrow.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5.1).toISOString(), isSender: false },
             { id: 'msg_3_2', contactId: 'usr_1', content: 'See you then!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), isSender: true },
        ],
    },
];
