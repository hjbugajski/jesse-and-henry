import { metadata } from '@/app/(site)/layout';
import { queryPage } from '@/app/actions/page';
import ProtectedForm from '@/components/forms/protected';
import type { PageProps } from '@/lib/types/page-props';
import { pageTitle } from '@/lib/utils/page';

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await queryPage({ slug });

  return {
    title: pageTitle(page?.title, metadata),
    description: page?.description || metadata.description,
  };
}

export default function Page() {
  return (
    <>
      <h1 className="mb-4 text-3xl tracking-wider">Protected</h1>
      <p className="mb-6 text-sm text-pretty">
        Enter the guest password found on the back of your save the date or included with your
        invitation to view this page.
      </p>
      <ProtectedForm />
    </>
  );
}
