'use client';

import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { InferType } from 'yup';
import { object, string } from 'yup';

import { fetchUserLogin } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/lib/hooks/use-toast';
import type { ActionState } from '@/lib/types/action-state';

const initialState: ActionState = {
  status: 'idle',
  message: null,
};

const formSchema = object({
  password: string().required('Password is required'),
});

export function ProtectedForm() {
  const [formState, setFormState] = useState(initialState);

  const form = useForm<InferType<typeof formSchema>>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      password: '',
    },
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  async function onSubmit(values: InferType<typeof formSchema>) {
    setFormState({ status: 'pending', message: null });

    const state = await fetchUserLogin(values);

    if (state.status === 'valid') {
      router.push(searchParams.get('redirectUrl') || '/');
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
        <Button type="submit" disabled={formState.status === 'pending'} size="lg" variant="solid">
          {formState.status === 'pending' ? <Spinner /> : 'Submit'}
        </Button>
      </form>
    </Form>
  );
}
