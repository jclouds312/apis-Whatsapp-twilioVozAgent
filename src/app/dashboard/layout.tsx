'use client';

import type { Metadata } from 'next';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { Header } from '@/components/dashboard/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg text-sidebar-foreground">
            <Sparkles className="h-6 w-6 text-accent" />
            <span>OmniFlow</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <DashboardNav />
        </SidebarContent>
        <SidebarFooter>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
