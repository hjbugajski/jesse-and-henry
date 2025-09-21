import * as migration_20250221_201328 from './20250221_201328';
import * as migration_20250302_161150 from './20250302_161150';
import * as migration_20250302_230800 from './20250302_230800';
import * as migration_20250322_004412 from './20250322_004412';
import * as migration_20250921_175307 from './20250921_175307';

export const migrations = [
  {
    up: migration_20250221_201328.up,
    down: migration_20250221_201328.down,
    name: '20250221_201328',
  },
  {
    up: migration_20250302_161150.up,
    down: migration_20250302_161150.down,
    name: '20250302_161150',
  },
  {
    up: migration_20250302_230800.up,
    down: migration_20250302_230800.down,
    name: '20250302_230800',
  },
  {
    up: migration_20250322_004412.up,
    down: migration_20250322_004412.down,
    name: '20250322_004412',
  },
  {
    up: migration_20250921_175307.up,
    down: migration_20250921_175307.down,
    name: '20250921_175307'
  },
];
