
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
  PlusCircle,
  ScrollText,
  Users,
  Workflow,
  ChevronDown,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const navItems = [
  { 
    href: '/dashboard', 
    icon: LayoutDashboard, 
    label: 'Dashboard' 
  },
  {
    href: '/dashboard/api-keys',
    icon: KeyRound,
    label: 'API Keys',
    subItems: [
      { href: '/dashboard/api-keys', label: 'Manage Keys' },
    ],
  },
  {
    href: '/dashboard/api-exhibition',
    icon: CodeXml,
    label: 'API Exhibition',
    subItems: [
      { href: '/dashboard/api-exhibition', label: 'Exposed APIs' },
    ],
  },
  {
    href: '/dashboard/function-connect',
    icon: Workflow,
    label: 'Function Connect',
     subItems: [
      { href: '/dashboard/function-connect', label: 'Workflows' },
    ],
  },
  {
    href: '/dashboard/integrations',
    icon: PlusCircle,
    label: 'Integrations',
    subItems: [
        { href: '/dashboard/whatsapp', icon: MessageSquare, label: 'WhatsApp' },
        { href: '/dashboard/twilio', icon: Phone, label: 'Twilio Voice' },
        { href: '/dashboard/crm', icon: Contact, label: 'CRM' },
    ]
  },
  {
    href: '/dashboard/ai-agents',
    icon: Bot,
    label: 'AI Agents',
    subItems: [
      { href: '/dashboard/function-connect', label: 'Workflow Suggester' },
      { href: '/dashboard/function-connect', label: 'Retell Agent' },
    ],
  },
  {
    href: '/dashboard/logs',
    icon: ScrollText,
    label: 'Logs & Audit',
    subItems: [
      { href: '/dashboard/logs', label: 'System Logs' },
    ],
  },
  {
    href: '/dashboard/users',
    icon: Users,
    label: 'Users & Roles',
    subItems: [
      { href: '/dashboard/users', label: 'Manage Users' },
    ],
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Find the parent item of the currently active sub-item
    const activeParent = navItems.find(item => 
      item.subItems && item.subItems.some(sub => pathname.startsWith(sub.href))
    );
    
    if (activeParent) {
      setOpenSections(prev => ({ ...prev, [activeParent.label]: true }));
    }
  }, [pathname]);

  const toggleSection = (label: string) => {
    setOpenSections(prev => ({...prev, [label]: !prev[label]}));
  }

  return (
    <nav className="flex flex-col gap-2 px-4 py-2">
      {navItems.map(({ href, icon: Icon, label, subItems }) =>
        subItems ? (
          <Collapsible key={label} open={openSections[label]} onOpenChange={() => toggleSection(label)} className="w-full">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-lg h-12",
                  // An item is active if its own href matches, or if a sub-item's href matches
                  (pathname.startsWith(href) && href !== '/dashboard') && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-6 w-6 mr-4" />
                {label}
                <ChevronDown className={cn("ml-auto h-5 w-5 transition-transform", openSections[label] && "rotate-180")} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="py-1 pl-8">
              <div className="flex flex-col gap-1 border-l-2 border-sidebar-border/50">
                {subItems.map(subItem => {
                   const SubIcon = subItem.icon;
                   return (
                    <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                        'block pl-4 pr-3 py-2 rounded-md text-base hover:bg-sidebar-accent/50',
                        pathname === subItem.href ? 'bg-sidebar-accent/80 text-sidebar-accent-foreground font-semibold' : 'text-sidebar-foreground/80'
                        )}
                    >
                        <div className="flex items-center">
                           {SubIcon && <SubIcon className="h-5 w-5 mr-3" />}
                           <span>{subItem.label}</span>
                        </div>
                    </Link>
                   )
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <Link key={href} href={href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-lg h-12",
                pathname === href && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-6 w-6 mr-4" />
              {label}
            </Button>
          </Link>
        )
      )}
    </nav>
  );
}
