import type { Access, FieldAccess } from 'payload';

import type { PayloadUsersCollection } from '@/payload/payload-types';

export const Role = {
  Admin: 'admin',
  Editor: 'editor',
  Public: 'public',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

function roleAccess(user: PayloadUsersCollection | null, roles: Role[]): boolean {
  return roles.some((r) => user?.roles?.includes(r));
}

export function hasRole(...roles: Role[]): Access {
  return ({ req }) => roleAccess(req.user, roles);
}

export function hasRoleField(...roles: Role[]): FieldAccess {
  return ({ req }) => roleAccess(req.user, roles);
}

export function hasRoleOrSelf(...roles: Role[]): Access {
  return ({ req: { user } }) => roleAccess(user, roles) || { id: { equals: user?.id } };
}

export function hasRoleOrSelfField(...roles: Role[]): FieldAccess {
  return ({ req: { user }, id }) => roleAccess(user, roles) || user?.id === id;
}

export function hasRoleOrPublished(...roles: Role[]): Access {
  return ({ req: { user } }) => roleAccess(user, roles) || { _status: { equals: 'published' } };
}

export function hasAuthAndNotProtectedField(): FieldAccess {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return ({ req: { user }, doc }) => (user ? true : doc?.protected === false);
}
