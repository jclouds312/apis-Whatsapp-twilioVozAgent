'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from './login/actions';
import { useUser, FirebaseClientProvider } from '@/firebase';

function LoginButton() {
  return (
    <Button className="w-full" type="submit">
      Logging in...
    </Button>
  );
}

function AutoLoginForm() {
  const [state, formAction] = useActionState(login, { message: null });
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    // Automatically submit the form once on mount
    const timer = setTimeout(() => {
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }, 100); // Small delay to ensure form is ready

    return () => clearTimeout(timer);
  }, []);

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
          <form ref={formRef} action={formAction} className="grid gap-4">
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
            <LoginButton />
            {state?.message && (
              <p className="text-sm font-medium text-destructive text-center">{state.message}</p>
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
