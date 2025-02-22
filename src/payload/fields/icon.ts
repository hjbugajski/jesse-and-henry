import type { Field } from 'payload';

export const icon: Field = {
  name: 'icon',
  type: 'select',
  interfaceName: 'PayloadIconField',
  options: [
    {
      label: 'Alert',
      value: 'alert',
    },
    {
      label: 'Arrow right',
      value: 'arrowRight',
    },
    {
      label: 'Borgo Corsignano',
      value: 'borgoCorsignano',
    },
    {
      label: 'Chevron down',
      value: 'chevronDown',
    },
    {
      label: 'Close',
      value: 'close',
    },
    {
      label: 'External link',
      value: 'externalLink',
    },
    {
      label: 'Heart',
      value: 'heart',
    },
    {
      label: 'Help',
      value: 'help',
    },
    {
      label: 'Info',
      value: 'info',
    },
    {
      label: 'Menu',
      value: 'menu',
    },
  ],
};
