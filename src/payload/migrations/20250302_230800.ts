import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "_pages_v_autosave_idx";
  ALTER TABLE "pages" ADD COLUMN "path" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_path" varchar;
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_path_idx" ON "pages" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_path_idx" ON "_pages_v" USING btree ("version_path");
  ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "autosave";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "pages_path_idx";
  DROP INDEX IF EXISTS "_pages_v_version_version_path_idx";
  ALTER TABLE "_pages_v" ADD COLUMN "autosave" boolean;
  CREATE INDEX IF NOT EXISTS "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "path";
  ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_path";`)
}
