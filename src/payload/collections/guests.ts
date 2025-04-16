import { customAlphabet } from 'nanoid';
import type {
  CollectionAfterChangeHook,
  CollectionBeforeValidateHook,
  CollectionConfig,
  Field,
  PayloadHandler,
  PayloadRequest,
} from 'payload';

import { env } from '@/env/server';
import {
  Role,
  hasRole,
  hasRoleField,
  hasRoleSelfOrParty,
  hasRoleSelfPartyOrBeforeDeadline,
} from '@/payload/access';
import { type PayloadGuestsCollection } from '@/payload/payload-types';
import { deepMerge } from '@/payload/utils/deep-merge';
import { getValue } from '@/utils/get-value';

function cleanString(str: string) {
  return str.toLowerCase().replace(/[^a-zA-Z]/g, '');
}

async function generateRandomEmail({ payload }: PayloadRequest) {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 32);
  const emails = await payload
    .find({ collection: 'guests', pagination: false })
    .then((data) => data.docs.map((doc) => doc.email))
    .then((emails) => new Set(emails));
  let email: string;

  do {
    email = `${nanoid()}@${env.DOMAIN}`;
  } while (emails.has(email));

  return email;
}

const beforeValidateHook: CollectionBeforeValidateHook<PayloadGuestsCollection> = async ({
  data,
  req,
}) => {
  if (!data) {
    return data;
  }

  const { payload } = req;
  const { email, first, middle, last, sort } = data;
  const limit = await payload.count({ collection: 'guests' }).then((data) => data.totalDocs);
  const newSort = sort === null || sort === undefined || sort === -1 ? limit : sort;
  let newEmail = email;

  if (first && last) {
    const middleName = middle ? `.${cleanString(middle)}` : '';

    newEmail = `${cleanString(first)}${middleName}.${cleanString(last)}@${env.DOMAIN}`;
  } else {
    newEmail = await generateRandomEmail(req);
  }

  return Object.assign(data, {
    email: newEmail,
    sort: newSort,
  });
};

const afterChangeHook: CollectionAfterChangeHook<PayloadGuestsCollection> = async ({
  doc,
  previousDoc,
  req,
}) => {
  const { payload } = req;
  const prevParty = getValue(previousDoc, 'party.id');
  const party = getValue(doc, 'party.id');

  if (!party || party === prevParty) {
    return doc;
  }

  const codePromise = payload
    .findByID({ collection: 'parties', id: party })
    .then((data) => data.code);
  const tokenPromise = payload.forgotPassword({
    collection: 'guests',
    data: { email: doc.email },
    disableEmail: true,
    req,
  });
  const [code, token] = await Promise.all([codePromise, tokenPromise]);

  await payload.resetPassword({
    collection: 'guests',
    data: {
      password: `${env.GUEST_PASSWORD}-${code}`,
      token,
    },
    overrideAccess: true,
    req,
  });

  return doc;
};

const rootPostHandler: PayloadHandler = async (req) => {
  try {
    if (!hasRole(Role.Admin)({ req })) {
      return Response.json({ errors: [{ message: 'Unauthorized' }] }, { status: 401 });
    }

    const { payload } = req;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = req.json ? await req.json() : {};
    const doc = await payload.create({
      collection: 'guests',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: Object.assign(data, {
        password: `${env.GUEST_PASSWORD}-party`,
      }),
    });

    return Response.json({ message: 'Guest successfully created', doc }, { status: 200 });
  } catch (error) {
    return Response.json({ errors: [{ message: JSON.stringify(error) }] }, { status: 500 });
  }
};

const reorderPatchHandler: PayloadHandler = async (req) => {
  try {
    if (!hasRole(Role.Admin)({ req })) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = req;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const reqDocs: PayloadGuestsCollection[] = req.json
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        await req.json().then((data) => data.docs)
      : [];

    const docs = await Promise.all(
      reqDocs.map((guest, index: number) =>
        payload.update({
          collection: 'guests',
          id: guest.id,
          data: {
            sort: index,
          },
        }),
      ),
    );

    return Response.json({ message: 'Guests reordered', docs }, { status: 200 });
  } catch (error) {
    return Response.json({ errors: [{ message: JSON.stringify(error) }] }, { status: 500 });
  }
};

const rsvpOptionField: Partial<Field> = {
  type: 'select',
  interfaceName: 'PayloadRsvpField',
  admin: {
    isClearable: true,
  },
  options: [
    {
      label: 'Accepted',
      value: 'accept',
    },
    {
      label: 'Declined',
      value: 'decline',
    },
  ],
};

const yesNoOptionField: Partial<Field> = {
  type: 'select',
  interfaceName: 'PayloadYesNoField',
  admin: {
    isClearable: true,
  },
  options: [
    {
      label: 'Yes',
      value: 'yes',
    },
    {
      label: 'No',
      value: 'no',
    },
  ],
};

export const Guests: CollectionConfig<'guests'> = {
  slug: 'guests',
  typescript: {
    interface: 'PayloadGuestsCollection',
  },
  auth: true,
  admin: {
    useAsTitle: 'first',
    group: 'Guest Collections',
    pagination: {
      defaultLimit: 100,
      limits: [5, 10, 25, 50, 100, 250, 500],
    },
    defaultColumns: ['first', 'last', 'party', 'side', 'relation'],
  },
  defaultSort: 'sort',
  disableDuplicate: true,
  hooks: {
    beforeValidate: [beforeValidateHook],
    afterChange: [afterChangeHook],
  },
  access: {
    create: hasRole(Role.Admin),
    read: hasRoleSelfOrParty(Role.Admin),
    update: async (args) => await hasRoleSelfPartyOrBeforeDeadline(args, Role.Admin),
    delete: hasRole(Role.Admin),
  },
  endpoints: [
    {
      path: '/',
      method: 'post',
      handler: rootPostHandler,
    },
    {
      path: '/reorder',
      method: 'patch',
      handler: reorderPatchHandler,
    },
  ],
  fields: [
    {
      name: 'email',
      type: 'email',
      access: {
        read: hasRoleField(Role.Admin),
        update: hasRoleField(Role.Admin),
      },
    },
    {
      name: 'first',
      label: 'First Name',
      type: 'text',
    },
    {
      name: 'middle',
      label: 'Middle Name',
      type: 'text',
    },
    {
      name: 'last',
      label: 'Last Name',
      type: 'text',
    },
    {
      name: 'party',
      type: 'relationship',
      relationTo: 'parties',
      access: {
        read: hasRoleField(Role.Admin),
        update: hasRoleField(Role.Admin),
      },
    },
    {
      name: 'side',
      type: 'relationship',
      relationTo: 'sides',
      access: {
        read: hasRoleField(Role.Admin),
        update: hasRoleField(Role.Admin),
      },
    },
    {
      name: 'relation',
      type: 'relationship',
      relationTo: 'relations',
      access: {
        read: hasRoleField(Role.Admin),
        update: hasRoleField(Role.Admin),
      },
    },
    {
      name: 'phone',
      type: 'text',
      access: {
        read: hasRoleField(Role.Admin),
        update: hasRoleField(Role.Admin),
      },
    },
    {
      name: 'address',
      type: 'textarea',
      access: {
        read: hasRoleField(Role.Admin),
        update: hasRoleField(Role.Admin),
      },
    },
    deepMerge<Field>(rsvpOptionField, {
      name: 'rsvpWelcomeParty',
      label: 'RSVP Welcome Party',
    }),
    deepMerge<Field>(rsvpOptionField, {
      name: 'rsvpRehearsalDinner',
      label: 'RSVP Rehearsal Dinner',
    }),
    deepMerge<Field>(rsvpOptionField, {
      name: 'rsvpWeddingDay',
      label: 'RSVP Wedding Day',
    }),
    deepMerge<Field>(rsvpOptionField, {
      name: 'rsvpPoolDay',
      label: 'RSVP Pool Day',
    }),
    deepMerge<Field>(yesNoOptionField, {
      name: 'transportationToVenue',
      label: 'Transportation to Venue',
    }),
    deepMerge<Field>(yesNoOptionField, {
      name: 'transportationFromVenue',
      label: 'Transportation from Venue',
    }),
    {
      name: 'legalName',
      type: 'text',
    },
    {
      name: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'text',
    },
    {
      name: 'countryOfBirth',
      label: 'Country of Birth',
      type: 'text',
    },
    {
      name: 'allergies',
      type: 'textarea',
    },

    {
      name: 'mealPreference',
      type: 'select',
      interfaceName: 'PayloadMealPreferenceField',
      admin: {
        isClearable: true,
      },
      options: [
        {
          label: 'Beef',
          value: 'beef',
        },
        {
          label: 'Fish',
          value: 'fish',
        },
        {
          label: 'Vegetarian',
          value: 'vegetarian',
        },
      ],
    },
    {
      name: 'sort',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
      access: {
        read: hasRoleField(Role.Admin),
        update: hasRoleField(Role.Admin),
      },
      defaultValue: 0,
    },
  ],
};
