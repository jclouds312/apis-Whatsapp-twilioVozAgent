'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CodeXml,
  Contact,
  KeyRound,
  LayoutDashboard,
  MessageSquare,
  Phone,
  ScrollText,
  Users,
  Workflow,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/api-keys', icon: KeyRound, label: 'API Keys' },
  { href: '/dashboard/api-exhibition', icon: CodeXml, label: 'API Exhibition' },
  { href: '/dashboard/function-connect', icon: Workflow, label: 'Function Connect' },
  { href: '/dashboard/whatsapp', icon: MessageSquare, label: 'WhatsApp' },
  { href: '/dashboard/twilio', icon: Phone, label: 'Twilio Voice' },
  { href: '/dashboard/crm', icon: Contact, label: 'CRM' },
  { href: '/dashboard/logs', icon: ScrollText, label: 'Logs & Audit' },
  { href: '/dashboard/users', icon: Users, label: 'Users & Roles' },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start text-lg font-medium">
      <SidebarMenu>
        {navItems.map(({ href, icon: Icon, label }) => (
          <SidebarMenuItem key={href}>
            <Link href={href}>
              <SidebarMenuButton
                isActive={pathname === href}
                tooltip={label}
                className="justify-start"
              >
                <Icon className="h-8 w-8" />
                <span className="text-lg">{label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </nav>
  );
}
