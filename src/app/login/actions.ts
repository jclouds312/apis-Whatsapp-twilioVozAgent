'use server';

import { initiateEmailSignIn } from '@/firebase';
import { getAuth } from 'firebase/auth';

// This is a server-side action. We can't directly use the `useAuth` hook here.
// We need to manage the auth instance differently on the server.
// For simplicity in this context, we will assume a way to get the auth instance,
// but in a real app, this would require passing it or using a server-side admin SDK setup.
// Let's assume a simplified (and not production-ready for multi-user) way to get auth.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

function getAuthInstance() {
    if (!getApps().length) {
        const app = initializeApp(firebaseConfig);
        return getAuth(app);
    }
    return getAuth(getApp());
}


export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password) {
    return { message: 'Please enter both email and password.' };
  }

  try {
    const auth = getAuthInstance();
    // We are calling this for its side-effect of logging in the user.
    // The actual redirection and state update will be handled by the client-side
    // onAuthStateChanged listener. We won't get a user object back here directly
    // in a way that's useful for the server action response.
    initiateEmailSignIn(auth, email, password);

    // Because this is a server action and auth state is managed on the client,
    // we can't directly confirm success here. We rely on the client listener.
    // We can return a neutral or pending state. A more advanced setup might
    // involve client-side polling or waiting for the auth state to change.
    
    // For now, we will return nothing, and the client will handle the redirect.
    return { message: null };

  } catch (e: any) {
    // This catch block might not effectively catch auth errors from Firebase
    // because `initiateEmailSignIn` is non-blocking. Errors are typically
    // caught by an onAuthStateChanged listener or a .catch() on the client.
    // However, we include it for any synchronous errors.
    return { message: `Login failed: ${e.message}` };
  }
}
