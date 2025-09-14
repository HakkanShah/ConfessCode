'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { KeyRound } from 'lucide-react';
import { authenticateAdmin } from '@/lib/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Signing In...
        </>
      ) : (
        <>
          <KeyRound className="mr-2 h-4 w-4" />
          Sign In
        </>
      )}
    </Button>
  );
}

export default function AdminLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [state, formAction] = useActionState(authenticateAdmin, {
    message: '',
    success: false,
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Success!',
        description: state.message,
      });
      router.push('/admin');
    } else if (state.message) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: state.message,
      });
    }
  }, [state, toast, router]);

  return (
    <div className="container max-w-sm mx-auto py-12 px-4 flex items-center min-h-[80vh]">
      <Card className="w-full">
        <form action={formAction} ref={formRef}>
          <CardHeader className="text-center">
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>
              Enter the secret key to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              name="secretKey"
              type="password"
              placeholder="Enter Your Secret Key"
              required
            />
          </CardContent>
          <CardFooter>
             <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
