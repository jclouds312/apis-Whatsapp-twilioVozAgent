'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from './actions';
import { useUser, FirebaseClientProvider } from '@/firebase';

function LoginButton() {  
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" disabled={pending}>
      {pending ? 'Logging in...' : 'Login'}
    </Button>
  );
}


function LoginForm() {
  const [state, formAction] = useActionState(login, { message: null });
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);


  return (
     <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">APIs Manager Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" name="password" required />
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

export default function LoginPage() {
    return (
        <FirebaseClientProvider>
            <LoginForm />
        </FirebaseClientProvider>
    )
}
