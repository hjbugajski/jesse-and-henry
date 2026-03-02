'use client';

import { useRowLabel } from '@payloadcms/ui';
import type { Data } from 'payload';

import { getValue } from '@/utils/get-value';

export function RowLabel({ path, fallback }: { path: string; fallback: string }) {
  const { data, rowNumber } = useRowLabel<Data>();
  const fieldValue = getValue(data, path);

  return String(fieldValue || '') || `${fallback} ${rowNumber}`;
}
