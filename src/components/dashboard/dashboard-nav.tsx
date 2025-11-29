'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CodeXml,
  KeyRound,
  LayoutDashboard,
  MessageSquare,
  Phone,
  ScrollText,
  Users,
  Workflow,
  Sparkles,
  Github
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Separator } from '../ui/separator';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/api-keys', icon: KeyRound, label: 'API Keys' },
  { href: '/dashboard/api-exhibition', icon: CodeXml, label: 'API Exhibition' },
  { href: '/dashboard/function-connect', icon: Workflow, label: 'Function Connect' },
  { href: '/dashboard/whatsapp', icon: MessageSquare, label: 'WhatsApp' },
  { href: '/dashboard/twilio', icon: Phone, label: 'Twilio' },
  { href: '/dashboard/logs', icon: ScrollText, label: 'Logs & Audit' },
  { href: '/dashboard/users', icon: Users, label: 'Users & Roles' },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start text-sm font-medium">
      <SidebarMenu>
        {navItems.map(({ href, icon: Icon, label }) => (
          <SidebarMenuItem key={href}>
            <Link href={href}>
              <SidebarMenuButton
                isActive={pathname === href}
                tooltip={label}
                className="justify-start"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </nav>
  );
}
