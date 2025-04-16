import type { Metadata } from 'next';

export function pageTitle(title: string | undefined, metadata: Metadata) {
  if (!title || title?.toLowerCase() === 'home') {
    return metadata.title;
  }

  return `${title} | ${metadata.title as string}`;
}
