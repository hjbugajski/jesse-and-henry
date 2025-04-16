'use client';

import type { ComponentProps } from 'react';

function formatDate(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const Time = ({ dateTime, ...props }: ComponentProps<'time'>) => (
  <time dateTime={dateTime} {...props}>
    {formatDate(dateTime)}
  </time>
);

export { Time };
