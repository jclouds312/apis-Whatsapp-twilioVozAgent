'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CodeXml,
  LayoutDashboard,
  ScrollText,
  Users,
  Workflow,
  ChevronDown,
  Bot,
  Settings,
  Volume2,
  ShieldCheck,
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

// Custom SVG Icons for Brands
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="#25D366" d="M19.05 4.94C17.02 2.91 14.63 1.83 12 1.83C6.38 1.83 1.83 6.38 1.83 12c0 2.02.59 3.93 1.66 5.54L2.2 22l4.63-1.21c1.55 1.01 3.39 1.54 5.17 1.54h.01c5.61 0 10.17-4.56 10.17-10.17c0-2.63-1.07-5.02-3.11-7.06zM12 20.47c-1.63 0-3.19-.5-4.53-1.39l-.32-.19l-3.37.89l.9-3.28l-.21-.33c-.93-1.46-1.41-3.14-1.41-4.88c0-4.63 3.76-8.39 8.39-8.39c2.23 0 4.31.87 5.86 2.42c1.55 1.55 2.42 3.63 2.42 5.86c.01 4.63-3.75 8.4-8.38 8.4zM17.3 14.4c-.28-.14-1.66-.82-1.92-.91c-.26-.1-.45-.14-.64.14c-.19.28-.73.91-.89 1.1s-.32.22-.59.08c-1.29-.49-2.28-1.12-3.13-2.43c-.23-.36-.04-.55.08-.68c.11-.11.24-.28.36-.42c.12-.14.16-.25.24-.41c.08-.17.04-.31-.02-.45c-.06-.14-.64-1.53-.87-2.1c-.23-.56-.46-.48-.64-.49c-.17-.01-.36-.01-.55-.01c-.19 0-.5.07-.76.35c-.26.28-.99 1-1.22 2.4c-.23 1.4.15 2.94.8 4.09c.81 1.42 2.02 2.76 4.19 3.74c.48.22.9.35 1.43.49c.87.21 1.5.17 2.05-.09c.6-.28 1.41-1.02 1.61-1.94c.2-.92.2-1.7-.08-1.94c-.28-.24-.55-.11-.83-.02z" />
  </svg>
);

const TwilioIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="#F22F46" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm-1-12h2v8h-2v-8zm-3-2h2v12H8V8zm6 0h2v12h-2V8z" />
  </svg>
);

const CrmIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  {
    href: '/dashboard/communications',
    icon: WhatsAppIcon,
    label: 'Communications',
    color: 'text-[#25D366]',
    subItems: [
      { href: '/dashboard/whatsapp', icon: WhatsAppIcon, label: 'WhatsApp', color: 'text-[#25D366]' },
      { href: '/dashboard/twilio', icon: TwilioIcon, label: 'Twilio Voice', color: 'text-[#F22F46]' },
      { href: '/dashboard/twilio/verify', icon: ShieldCheck, label: 'Phone Verify', color: 'text-blue-500' },
    ]
  },
  { href: '/dashboard/crm', icon: CrmIcon, label: 'CRM', color: 'text-sky-500'},
  {
    href: '/dashboard/automation',
    icon: Workflow,
    label: 'Automation',
    subItems: [
      { href: '/dashboard/function-connect', icon: Workflow, label: 'Function Connect' },
      { href: '/dashboard/exposed-apis', icon: CodeXml, label: 'Exposed APIs' },
    ]
  },
  {
    href: '/dashboard/ai-agents',
    icon: Bot,
    label: 'AI Agents',
    subItems: [
      { href: '/dashboard/ai-agents/retell', label: 'Retell Agent' },
      { href: '/dashboard/ai-agents/workflow-suggester', label: 'Workflow Suggester' },
      { href: '/dashboard/ai-agents/text-to-speech', icon: Volume2, label: 'Text-to-Speech' },
    ]
  },
  { href: '/dashboard/logs', icon: ScrollText, label: 'Logs & Audit' },
  { href: '/dashboard/users', icon: Users, label: 'Users & Roles' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
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
      // Logic to auto-open parent on direct navigation can be complex, keeping it user-driven.
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
                <item.icon className={cn("h-6 w-6 mr-4", item.color)} />
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
                           {SubIcon && <SubIcon className={cn("h-5 w-5 mr-3", subItem.color)} />}
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
              <item.icon className={cn("h-6 w-6 mr-4", item.color)} />
              {item.label}
            </Button>
          </Link>
        )
      )}
    </nav>
  );
}
