
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CodeXml,
  Contact,
  LayoutDashboard,
  MessageSquare,
  Phone,
  PlusCircle,
  ScrollText,
  Users,
  Workflow,
  ChevronDown,
  Bot,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useSidebar } from '@/components/ui/sidebar';

const navItems = [
  { 
    href: '/dashboard', 
    icon: LayoutDashboard, 
    label: 'Dashboard' 
  },
  {
    href: '/dashboard/api-exhibition',
    icon: CodeXml,
    label: 'API Exhibition',
  },
  {
    href: '/dashboard/function-connect',
    icon: Workflow,
    label: 'Function Connect',
  },
  {
    href: '/dashboard/ai-agents',
    icon: Bot,
    label: 'AI Agents',
    subItems: [
        { href: '/dashboard/ai-agents/retell', label: 'Retell Agent' },
        { href: '/dashboard/ai-agents/workflow-suggester', label: 'Workflow Suggester' },
    ]
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
    href: '/dashboard/logs',
    icon: ScrollText,
    label: 'Logs & Audit',
  },
  {
    href: '/dashboard/users',
    icon: Users,
    label: 'Users & Roles',
  },
  {
    href: '/dashboard/settings',
    icon: Settings,
    label: 'Settings',
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    navItems.forEach(item => {
      if (item.subItems) {
        initialState[item.label] = item.subItems.some(sub => pathname.startsWith(sub.href));
      }
    });
    return initialState;
  });

  useEffect(() => {
    const activeParent = navItems.find(item => 
      item.subItems && item.subItems.some(sub => pathname.startsWith(sub.href))
    );
    
    if (activeParent && !openSections[activeParent.label]) {
      setOpenSections(prev => ({ ...prev, [activeParent.label]: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const toggleSection = (label: string) => {
    setOpenSections(prev => ({...prev, [label]: !prev[label]}));
  }

  return (
    <nav className="flex flex-col gap-2 px-4 py-2">
      {navItems.map((item) =>
        item.subItems ? (
          <Collapsible key={item.label} open={openSections[item.label] ?? false} onOpenChange={() => toggleSection(item.label)} className="w-full">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-lg h-12",
                  item.subItems.some(sub => pathname.startsWith(sub.href)) && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-6 w-6 mr-4" />
                {item.label}
                <ChevronDown className={cn("ml-auto h-5 w-5 transition-transform", openSections[item.label] && "rotate-180")} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="py-1 pl-8">
              <div className="flex flex-col gap-1 border-l-2 border-sidebar-border/50">
                {item.subItems.map(subItem => {
                   const SubIcon = subItem.icon;
                   return (
                    <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={handleLinkClick}
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
          <Link key={item.href} href={item.href} onClick={handleLinkClick}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-lg h-12",
                pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-6 w-6 mr-4" />
              {item.label}
            </Button>
          </Link>
        )
      )}
    </nav>
  );
}
