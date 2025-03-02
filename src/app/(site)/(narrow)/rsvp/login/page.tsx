import type { Metadata } from 'next';

import { RsvpLoginForm } from '@/components/forms/rsvp-login';

export const metadata: Metadata = {
  title: 'RSVP Login | Jesse & Henry',
  description: "Log in to RSVP to Jesse & Henry's wedding.",
};

export default function Page() {
  return (
    <>
      <h1 className="mb-4 text-3xl">RSVP login</h1>
      <RsvpLoginForm />
    </>
  );
}
