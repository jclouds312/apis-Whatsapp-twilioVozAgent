'use client';

import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import Link from 'next/link';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { FirebaseClientProvider, useUser, useAuth, initiateEmailSignIn, initiateEmailSignUp } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

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


function ProtectedDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [authAttempted, setAuthAttempted] = useState(false);

  useEffect(() => {
    if (isUserLoading || !auth) {
      return; // Wait for Firebase to initialize
    }

    if (!user && !authAttempted) {
      setAuthAttempted(true);

      const attemptLogin = async () => {
        try {
          // Firebase sign-in returns a promise that rejects on failure
          // We can't use the non-blocking version here as we need to react to the failure.
          await auth.signInWithEmailAndPassword('admin@example.com', 'password');
          // onAuthStateChanged will handle the rest.
        } catch (error: any) {
          // If sign-in fails because the user doesn't exist, create it.
          if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            console.log("User not found, attempting to create a new user...");
            try {
              await auth.createUserWithEmailAndPassword('admin@example.com', 'password');
              // onAuthStateChanged will now pick up the new user.
            } catch (signUpError) {
              console.error("Failed to create user after login failed:", signUpError);
            }
          } else {
            console.error("An unexpected error occurred during sign-in:", error);
          }
        }
      };

      attemptLogin();
    }
  }, [user, isUserLoading, auth, authAttempted]);


  if (isUserLoading || !user) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary"></div>
        </div>
    );
  }

  return (
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
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <FirebaseClientProvider>
      <ProtectedDashboardLayout>
        {children}
      </ProtectedDashboardLayout>
    </FirebaseClientProvider>
  );
}
