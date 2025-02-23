import type { Access, AccessArgs, AccessResult, FieldAccess, Where } from 'payload';

import type {
  PayloadGuestsCollection,
  PayloadPagesCollection,
  PayloadUsersCollection,
} from '@/payload/payload-types';

export const Role = {
  Admin: 'admin',
  Editor: 'editor',
  Public: 'public',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

function roleAccess(
  user: PayloadUsersCollection | PayloadGuestsCollection | null,
  roles: Role[],
): boolean {
  return roles.some((r) => user && 'roles' in user && user.roles.includes(r));
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

export function hasAuthAndNotProtectedField(): FieldAccess<PayloadPagesCollection> {
  return ({ req: { user }, doc }) => (user ? true : doc?.breadcrumbs?.[0]?.url !== '/protected');
}

const selfOrPartyQuery = (user: PayloadUsersCollection | PayloadGuestsCollection | null): Where => {
  const or: Where[] = [{ id: { equals: user?.id } }];

  if (user && 'party' in user) {
    const partyId = typeof user.party === 'string' ? user.party : user.party?.id;

    or.push({
      and: [
        { party: { exists: true } },
        { party: { not_equals: null } },
        { party: { equals: partyId } },
      ],
    });
  }

  return { or };
};

export function hasRoleSelfOrParty(...roles: Role[]): Access {
  return ({ req: { user } }) => roleAccess(user, roles) || selfOrPartyQuery(user);
}

export async function hasRoleSelfPartyOrBeforeDeadline(
  { req: { payload, user } }: AccessArgs,
  ...roles: Role[]
): Promise<AccessResult> {
  const beforeDeadline = await payload
    .findGlobal({ slug: 'config' })
    .then((config) => (config?.rsvpDeadline ? new Date() < new Date(config.rsvpDeadline) : true));

  return roleAccess(user, roles) || (beforeDeadline && selfOrPartyQuery(user));
}
