import * as migration_20250221_201328 from './20250221_201328';
import * as migration_20250302_161150 from './20250302_161150';

export const migrations = [
  {
    up: migration_20250221_201328.up,
    down: migration_20250221_201328.down,
    name: '20250221_201328',
  },
  {
    up: migration_20250302_161150.up,
    down: migration_20250302_161150.down,
    name: '20250302_161150'
  },
];
