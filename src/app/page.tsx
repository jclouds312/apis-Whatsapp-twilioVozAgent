'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, FirebaseClientProvider, useAuth, initiateEmailSignIn } from '@/firebase';

function LoginButton({isSubmitting}: {isSubmitting: boolean}) {
  return (
    <Button className="w-full" type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Logging in...' : 'Login'}
    </Button>
  );
}

function AutoLoginForm() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(true);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // initiateEmailSignIn is a non-blocking client-side function
      initiateEmailSignIn(auth, email, password);
      // The onAuthStateChanged listener in the provider will handle the redirect.
      // We don't need to do anything else here. The `isUserLoading` state will change,
      // and the useEffect above will trigger the navigation.
    } catch (e: any) {
      // This might catch synchronous errors if any, but Firebase auth errors
      // are typically asynchronous and handled by the listener.
      setErrorMessage(e.message || 'An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    // Automatically submit the form once on mount
    const timer = setTimeout(() => {
      if (formRef.current && !user) {
        // We can't directly call form.submit() as it won't trigger the React onSubmit handler.
        // Instead, we can create a synthetic submit event.
        const fakeSubmitEvent = new Event('submit', { bubbles: true, cancelable: true });
        formRef.current.dispatchEvent(fakeSubmitEvent);
      }
    }, 100); // Small delay to ensure form is ready

    return () => clearTimeout(timer);
  }, [user]);


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">APIs Manager Login</CardTitle>
          <CardDescription>
            Attempting automatic login. Please wait...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
                defaultValue="admin@example.com"
                readOnly
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                required
                defaultValue="password"
                readOnly
              />
            </div>
            <LoginButton isSubmitting={isSubmitting} />
            {errorMessage && (
              <p className="text-sm font-medium text-destructive text-center">{errorMessage}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


export default function HomePage() {
    return (
        <FirebaseClientProvider>
            <AutoLoginForm />
        </FirebaseClientProvider>
    )
}
