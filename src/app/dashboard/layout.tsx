'use client';

import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import Link from 'next/link';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { LogProvider } from '@/context/LogContext';
import { FirebaseClientProvider } from '@/firebase/client-provider';

const Logo = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-accent"
  >
    <path
      d="M14 2.33331C16.9036 2.33331 19.6853 3.19325 21.968 4.76118C24.2507 6.32911 25.9228 8.53039 26.7649 11.0255C27.6071 13.5206 27.5751 16.1913 26.676 18.6656C25.7769 21.1398 24.0673 23.2954 21.8169 24.8143"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.18311 24.8143C3.93275 23.2954 2.22312 21.1398 1.32402 18.6656C0.42492 16.1913 0.392934 13.5206 1.23508 11.0255C2.07722 8.53039 3.74929 6.32911 6.03203 4.76118C8.31477 3.19325 11.0964 2.33331 14 2.33331"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 14L21.8333 9.33331"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 23.3333V14"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 14L6.16669 9.33331"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <FirebaseClientProvider>
      <LogProvider>
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg text-sidebar-foreground">
                <Logo />
                <span className="text-base font-semibold">APIs Manager</span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <DashboardNav />
            </SidebarContent>
            <SidebarFooter>
            </SidebarFooter>
          </Sidebar>
          <main className="flex flex-1 flex-col bg-background">
            {children}
          </main>
        </SidebarProvider>
      </LogProvider>
    </FirebaseClientProvider>
  );
}
