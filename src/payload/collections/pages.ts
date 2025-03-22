import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import { revalidatePath } from 'next/cache';
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  FieldHook,
} from 'payload';

import { slugify } from '@/lib/utils/slugify';
import { Role, hasAuthAndNotProtectedField, hasRole, hasRoleOrPublished } from '@/payload/access';
import { Hero } from '@/payload/blocks/hero';
import { Section } from '@/payload/blocks/section';
import type { PayloadPagesCollection } from '@/payload/payload-types';

const setSlug: FieldHook<
  PayloadPagesCollection,
  string | null | undefined,
  PayloadPagesCollection
> = ({ data, operation }) => {
  if (operation === 'create' || operation === 'update') {
    return slugify(data?.title);
  }
};

const setPath: CollectionAfterChangeHook<PayloadPagesCollection> = ({ context, doc, req }) => {
  if (!doc?.title || !doc?.breadcrumbs?.length || context?.ignoreSetSlugAndPath) {
    return doc;
  }

  const slug = slugify(doc.title);
  const path = doc.breadcrumbs?.length
    ? doc.breadcrumbs[doc.breadcrumbs.length - 1].url
    : `/${slug}`;

  if (doc.path === path && doc.slug === slug) {
    return doc;
  }

  return req.payload.update({
    collection: 'pages',
    id: doc.id,
    data: {
      path,
    },
    context: {
      ignoreSetSlugAndPath: true,
    },
    req,
  });
};

const revalidatePageAfterChange: CollectionAfterChangeHook<PayloadPagesCollection> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc._status === 'published' && doc.path) {
    payload.logger.info(`Revalidating path: ${doc.path}`);

    if (doc.path === '/home') {
      revalidatePath('/');
    }

    revalidatePath(doc.path);
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published' && previousDoc.path) {
    payload.logger.info(`Revalidating previous path: ${previousDoc.path}`);

    if (doc.path === '/home') {
      revalidatePath('/');
    }

    revalidatePath(previousDoc.path);
  }

  return doc;
};

export const revalidatePageAfterDelete: CollectionAfterDeleteHook<PayloadPagesCollection> = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate && doc.path) {
    payload.logger.info(`Revalidating path: ${doc.path}`);

    if (doc.path === '/home') {
      revalidatePath('/');
    }

    revalidatePath(doc.path);
  }

  return doc;
};

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  typescript: {
    interface: 'PayloadPagesCollection',
  },
  versions: {
    drafts: true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', '_status', 'protected', 'updatedAt'],
  },
  access: {
    read: hasRoleOrPublished(Role.Admin, Role.Editor),
    create: hasRole(Role.Admin, Role.Editor),
    update: hasRole(Role.Admin, Role.Editor),
    delete: hasRole(Role.Admin),
  },
  hooks: {
    afterChange: [setPath, revalidatePageAfterChange],
    afterDelete: [revalidatePageAfterDelete],
  },
  defaultPopulate: {
    slug: true,
    path: true,
    breadcrumbs: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      access: {
        read: hasAuthAndNotProtectedField(),
      },
      editor: lexicalEditor({
        features: () => [BlocksFeature({ blocks: [Hero, Section] })],
      }),
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        position: 'sidebar',
      },
      filterOptions: ({ siblingData }) => ({
        path: {
          // @ts-expect-error – valid field
          not_equals: siblingData?.path,
        },
      }),
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [setSlug],
      },
    },
    {
      name: 'path',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'breadcrumbs',
      type: 'array',
      admin: {
        hidden: true,
        position: 'sidebar',
        readOnly: true,
        components: {
          RowLabel: {
            path: '@/payload/components/row-label.tsx',
            exportName: 'RowLabel',
            clientProps: {
              path: 'label',
              fallback: 'Breadcrumb',
            },
          },
        },
      },
      fields: [
        {
          name: 'url',
          label: 'Path',
          type: 'text',
        },
        {
          name: 'label',
          type: 'text',
        },
      ],
    },
  ],
};
