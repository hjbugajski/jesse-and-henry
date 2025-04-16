'use client';

import { useState } from 'react';

import { fetchLogout } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Icons } from '@/icons';
import { useToast } from '@/lib/hooks/use-toast';
import type { AuthCollection } from '@/lib/types/auth-collection';

interface Props {
  collection: AuthCollection;
  redirectUrl: string;
}

export function LogOutButton({ collection, redirectUrl }: Props) {
  const [pending, setPending] = useState(false);
  const { toast } = useToast();

  async function logout() {
    setPending(true);

    const state = await fetchLogout(collection, redirectUrl);

    if (state?.status === 'error') {
      toast({
        title: 'Logout error',
        description: 'There was an error logging out. Refresh the page and try again.',
        variant: 'danger',
      });
    }

    setPending(false);
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <Button onClick={logout} disabled={pending} size="sm" iconPosition="right">
      Log out
      {pending ? <Spinner /> : <Icons name="logout" size="sm" />}
    </Button>
  );
}
