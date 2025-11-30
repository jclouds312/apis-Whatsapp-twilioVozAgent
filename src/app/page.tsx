'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useUser, FirebaseClientProvider } from '@/firebase';

function AutoRedirect() {
    const { user, isUserLoading } = useUser();

    useEffect(() => {
        if (!isUserLoading) {
            redirect('/dashboard');
        }
    }, [user, isUserLoading]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary"></div>
        </div>
    );
}

export default function HomePage() {
    return (
        <FirebaseClientProvider>
            <AutoRedirect />
        </FirebaseClientProvider>
    )
}
