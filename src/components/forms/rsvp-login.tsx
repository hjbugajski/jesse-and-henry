'use client';

import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { type InferType, object, string } from 'yup';

import { fetchGuestLogin } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import type { ActionState } from '@/types/action-state';

const initialState: ActionState = {
  status: 'idle',
  message: null,
};

const formSchema = object({
  first: string().required('First name is required'),
  middle: string().optional(),
  last: string().required('Last name is required'),
  password: string().required('Password is required'),
  code: string().required('Code is required'),
});

export function RsvpLoginForm() {
  const [formState, setFormState] = useState(initialState);

  const form = useForm<InferType<typeof formSchema>>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      first: '',
      middle: '',
      last: '',
      password: '',
      code: '',
    },
  });
  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(values: InferType<typeof formSchema>) {
    setFormState({ status: 'pending', message: null });

    const state = await fetchGuestLogin(values);

    if (state.status === 'valid') {
      router.push('/rsvp');
    } else if (state.status === 'error') {
      setFormState(state);
      toast({
        title: 'Login failed',
        description: state.message,
        variant: 'danger',
      });
    } else {
      setFormState({ status: 'idle', message: null });
    }
  }

  return (
    <Form {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-4 text-left">
        <FormField
          control={form.control}
          name="first"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="middle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-1">Middle Name (optional)</FormLabel>
              <FormDescription>
                Only include your middle name if it is included in your invitation.
              </FormDescription>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Party Code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={formState.status === 'pending'} size="lg" variant="solid">
          {formState.status === 'pending' ? <Spinner /> : 'Submit'}
        </Button>
      </form>
    </Form>
  );
}
