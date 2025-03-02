import { type CollectionSlug } from 'payload';

export type AuthCollection = Extract<CollectionSlug, 'users' | 'guests'>;
