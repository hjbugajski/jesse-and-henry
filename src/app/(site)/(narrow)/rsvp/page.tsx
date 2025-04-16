import Link from 'next/link';

import { fetchGuest } from '@/actions/auth';
import { fetchCachedGlobal } from '@/actions/globals';
import { fetchGuests } from '@/actions/guests';
import { fetchCachedPage } from '@/actions/page';
import { metadata } from '@/app/(site)/layout';
import { RsvpForm } from '@/components/forms/rsvp';
import { LogOutButton } from '@/components/log-out-button';
import { Alert, AlertBody, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Time } from '@/components/ui/time';
import { Icons } from '@/icons';
import type { PageProps } from '@/lib/types/page-props';
import { pageTitle } from '@/lib/utils/page';
import type { PayloadConfigGlobal } from '@/payload/payload-types';

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await fetchCachedPage({ slug });

  return {
    title: pageTitle(page?.title, metadata),
    description: page?.description || metadata.description,
  };
}

function PageToolbar() {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h1 className="text-xl leading-none">RSVP</h1>
      <LogOutButton collection="guests" redirectUrl="/rsvp/login" />
    </div>
  );
}

export default async function Page() {
  const [guest, guests, config] = await Promise.all([
    fetchGuest(),
    fetchGuests(),
    fetchCachedGlobal<PayloadConfigGlobal>('config'),
  ]);

  if (!guest?.user || !guests?.length) {
    return (
      <>
        <PageToolbar />
        <Alert color="danger">
          <Icons name="alert" />
          <AlertBody className="flex flex-col gap-2">
            <p>
              There was an error loading your RSVP. Reload the page and try again. If the issue
              persists, email{' '}
              <Link href="mailto:support@jesseandhenry.com">support@jesseandhenry.com</Link>.
            </p>
          </AlertBody>
        </Alert>
      </>
    );
  }

  const { user } = guest;
  const disableRsvp = config?.rsvpDeadline ? new Date(config.rsvpDeadline) < new Date() : false;

  return (
    <>
      <PageToolbar />
      <h2 className="mb-2 text-3xl tracking-wider">Welcome, {user.first}</h2>
      <p className="mb-2 text-sm">
        {guests.length === 1 ? 'RSVP below.' : 'RSVP below for each guest in your party.'}
      </p>

      <div className="my-6 flex flex-col gap-2">
        <Alert color={disableRsvp ? 'danger' : 'tertiary'} className="[&>i]:leading-5">
          <Icons name={disableRsvp ? 'alert' : 'info'} />
          <AlertBody>
            {disableRsvp ? (
              <p>The RSVP deadline has passed. You can no longer make changes.</p>
            ) : null}
            {!disableRsvp ? (
              <>
                <AlertTitle>
                  {guests.length === 1 ? 'RSVP' : 'RSVPs'} must be submitted by{' '}
                  <Time dateTime={config.rsvpDeadline} className="font-bold" />
                </AlertTitle>
                <p>
                  If we have not received your response by this time, we will have to count you as
                  declined. Our venue requires us to provide final guest counts and accommodation
                  assignments a strict 3 months prior to our wedding. We apologize for any
                  inconvenience this might cause.
                </p>
              </>
            ) : null}
          </AlertBody>
        </Alert>
        <Alert className="[&>i]:leading-5">
          <Icons name="info" />
          <AlertBody>
            <p>
              More information about each wedding event can be found on the guest information page.
            </p>
          </AlertBody>
          <Button asChild size="sm" className="mt-4" iconPosition="right">
            <Link href="/protected/guest-information">
              View Information
              <Icons name="arrowRight" />
            </Link>
          </Button>
        </Alert>
      </div>

      <RsvpForm guest={user} disabled={disableRsvp} />
      {guests
        .filter((guest) => guest.id !== user.id)
        .map((guest) => (
          <RsvpForm key={guest.id} guest={guest} disabled={disableRsvp} />
        ))}

      <div className="border-t-2 border-neutral-variant-50/50 pt-6">
        <Alert>
          <Icons name="help" />
          <AlertBody>
            <AlertTitle>Support</AlertTitle>
            <p>
              If you are having any issues submitting RSVPs, reach out to{' '}
              <Link href="mailto:support@jesseandhenry.com">support@jesseandhenry.com</Link>.
            </p>
          </AlertBody>
        </Alert>
      </div>
    </>
  );
}
