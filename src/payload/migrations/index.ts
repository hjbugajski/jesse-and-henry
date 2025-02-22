import * as migration_20250221_201328 from './20250221_201328';

export const migrations = [
  {
    up: migration_20250221_201328.up,
    down: migration_20250221_201328.down,
    name: '20250221_201328'
  },
];
