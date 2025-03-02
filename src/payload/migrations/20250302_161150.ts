import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_guests_rsvp_welcome_party" AS ENUM('accept', 'decline');
  CREATE TYPE "public"."enum_guests_rsvp_rehearsal_dinner" AS ENUM('accept', 'decline');
  CREATE TYPE "public"."enum_guests_rsvp_wedding_day" AS ENUM('accept', 'decline');
  CREATE TYPE "public"."enum_guests_rsvp_pool_day" AS ENUM('accept', 'decline');
  CREATE TYPE "public"."enum_guests_transportation_to_venue" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_guests_transportation_from_venue" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_guests_meal_preference" AS ENUM('beef', 'fish', 'vegetarian');
  CREATE TYPE "public"."enum_parties_color" AS ENUM('gray', 'green', 'teal', 'cyan', 'blue', 'violet', 'purple', 'plum', 'pink', 'red', 'orange');
  CREATE TYPE "public"."enum_relations_color" AS ENUM('gray', 'green', 'teal', 'cyan', 'blue', 'violet', 'purple', 'plum', 'pink', 'red', 'orange');
  CREATE TYPE "public"."enum_sides_color" AS ENUM('gray', 'green', 'teal', 'cyan', 'blue', 'violet', 'purple', 'plum', 'pink', 'red', 'orange');
  ALTER TYPE "public"."enum_navigation_links_icon" ADD VALUE 'circleCheck' BEFORE 'close';
  ALTER TYPE "public"."enum_navigation_links_icon" ADD VALUE 'circleX' BEFORE 'close';
  ALTER TYPE "public"."enum_navigation_links_icon" ADD VALUE 'logout' BEFORE 'menu';
  ALTER TYPE "public"."enum_navigation_links_icon" ADD VALUE 'maximize' BEFORE 'menu';
  ALTER TYPE "public"."enum_navigation_links_icon" ADD VALUE 'minimize';
  ALTER TYPE "public"."enum_navigation_call_to_action_icon" ADD VALUE 'circleCheck' BEFORE 'close';
  ALTER TYPE "public"."enum_navigation_call_to_action_icon" ADD VALUE 'circleX' BEFORE 'close';
  ALTER TYPE "public"."enum_navigation_call_to_action_icon" ADD VALUE 'logout' BEFORE 'menu';
  ALTER TYPE "public"."enum_navigation_call_to_action_icon" ADD VALUE 'maximize' BEFORE 'menu';
  ALTER TYPE "public"."enum_navigation_call_to_action_icon" ADD VALUE 'minimize';
  CREATE TABLE IF NOT EXISTS "pages_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_version_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "guests" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"first" varchar,
  	"middle" varchar,
  	"last" varchar,
  	"party_id" uuid,
  	"side_id" uuid,
  	"relation_id" uuid,
  	"phone" varchar,
  	"address" varchar,
  	"rsvp_welcome_party" "enum_guests_rsvp_welcome_party",
  	"rsvp_rehearsal_dinner" "enum_guests_rsvp_rehearsal_dinner",
  	"rsvp_wedding_day" "enum_guests_rsvp_wedding_day",
  	"rsvp_pool_day" "enum_guests_rsvp_pool_day",
  	"transportation_to_venue" "enum_guests_transportation_to_venue",
  	"transportation_from_venue" "enum_guests_transportation_from_venue",
  	"legal_name" varchar,
  	"date_of_birth" varchar,
  	"country_of_birth" varchar,
  	"allergies" varchar,
  	"meal_preference" "enum_guests_meal_preference",
  	"sort" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "parties" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"value" varchar NOT NULL,
  	"color" "enum_parties_color" DEFAULT 'gray',
  	"sort" numeric DEFAULT 0,
  	"code" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "relations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"value" varchar NOT NULL,
  	"color" "enum_relations_color" DEFAULT 'gray',
  	"sort" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "sides" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"value" varchar NOT NULL,
  	"color" "enum_sides_color" DEFAULT 'gray',
  	"sort" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages" ADD COLUMN "parent_id" uuid;
  ALTER TABLE "_pages_v" ADD COLUMN "version_parent_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "guests_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "parties_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "relations_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sides_id" uuid;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "guests_id" uuid;
  DO $$ BEGIN
   ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "guests" ADD CONSTRAINT "guests_party_id_parties_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."parties"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "guests" ADD CONSTRAINT "guests_side_id_sides_id_fk" FOREIGN KEY ("side_id") REFERENCES "public"."sides"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "guests" ADD CONSTRAINT "guests_relation_id_relations_id_fk" FOREIGN KEY ("relation_id") REFERENCES "public"."relations"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "pages_breadcrumbs_order_idx" ON "pages_breadcrumbs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_breadcrumbs_parent_id_idx" ON "pages_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_breadcrumbs_order_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_breadcrumbs_parent_id_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "guests_party_idx" ON "guests" USING btree ("party_id");
  CREATE INDEX IF NOT EXISTS "guests_side_idx" ON "guests" USING btree ("side_id");
  CREATE INDEX IF NOT EXISTS "guests_relation_idx" ON "guests" USING btree ("relation_id");
  CREATE INDEX IF NOT EXISTS "guests_updated_at_idx" ON "guests" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "guests_created_at_idx" ON "guests" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "guests_email_idx" ON "guests" USING btree ("email");
  CREATE UNIQUE INDEX IF NOT EXISTS "parties_value_idx" ON "parties" USING btree ("value");
  CREATE UNIQUE INDEX IF NOT EXISTS "parties_code_idx" ON "parties" USING btree ("code");
  CREATE INDEX IF NOT EXISTS "parties_updated_at_idx" ON "parties" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "parties_created_at_idx" ON "parties" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "relations_value_idx" ON "relations" USING btree ("value");
  CREATE INDEX IF NOT EXISTS "relations_updated_at_idx" ON "relations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "relations_created_at_idx" ON "relations" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "sides_value_idx" ON "sides" USING btree ("value");
  CREATE INDEX IF NOT EXISTS "sides_updated_at_idx" ON "sides" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "sides_created_at_idx" ON "sides" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_parent_id_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_guests_fk" FOREIGN KEY ("guests_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parties_fk" FOREIGN KEY ("parties_id") REFERENCES "public"."parties"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_relations_fk" FOREIGN KEY ("relations_id") REFERENCES "public"."relations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sides_fk" FOREIGN KEY ("sides_id") REFERENCES "public"."sides"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_guests_fk" FOREIGN KEY ("guests_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "pages_parent_idx" ON "pages" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_parent_idx" ON "_pages_v" USING btree ("version_parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_guests_id_idx" ON "payload_locked_documents_rels" USING btree ("guests_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parties_id_idx" ON "payload_locked_documents_rels" USING btree ("parties_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_relations_id_idx" ON "payload_locked_documents_rels" USING btree ("relations_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_sides_id_idx" ON "payload_locked_documents_rels" USING btree ("sides_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_guests_id_idx" ON "payload_preferences_rels" USING btree ("guests_id");
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "protected";
  ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_protected";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guests" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "parties" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "relations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sides" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_breadcrumbs" CASCADE;
  DROP TABLE "_pages_v_version_breadcrumbs" CASCADE;
  DROP TABLE "guests" CASCADE;
  DROP TABLE "parties" CASCADE;
  DROP TABLE "relations" CASCADE;
  DROP TABLE "sides" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_parent_id_pages_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_parent_id_pages_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_guests_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_parties_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_relations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sides_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_guests_fk";
  
  DROP INDEX IF EXISTS "pages_parent_idx";
  DROP INDEX IF EXISTS "_pages_v_version_version_parent_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_guests_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_parties_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_relations_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_sides_id_idx";
  DROP INDEX IF EXISTS "payload_preferences_rels_guests_id_idx";
  ALTER TABLE "pages" ADD COLUMN "protected" boolean DEFAULT false;
  ALTER TABLE "_pages_v" ADD COLUMN "version_protected" boolean DEFAULT false;
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "parent_id";
  ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_parent_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "guests_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "parties_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "relations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "sides_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN IF EXISTS "guests_id";
  ALTER TABLE "public"."navigation_links" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_navigation_links_icon";
  CREATE TYPE "public"."enum_navigation_links_icon" AS ENUM('alert', 'arrowRight', 'borgoCorsignano', 'chevronDown', 'close', 'externalLink', 'heart', 'help', 'info', 'menu');
  ALTER TABLE "public"."navigation_links" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_navigation_links_icon" USING "icon"::"public"."enum_navigation_links_icon";
  ALTER TABLE "public"."navigation" ALTER COLUMN "call_to_action_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_navigation_call_to_action_icon";
  CREATE TYPE "public"."enum_navigation_call_to_action_icon" AS ENUM('alert', 'arrowRight', 'borgoCorsignano', 'chevronDown', 'close', 'externalLink', 'heart', 'help', 'info', 'menu');
  ALTER TABLE "public"."navigation" ALTER COLUMN "call_to_action_icon" SET DATA TYPE "public"."enum_navigation_call_to_action_icon" USING "call_to_action_icon"::"public"."enum_navigation_call_to_action_icon";
  DROP TYPE "public"."enum_guests_rsvp_welcome_party";
  DROP TYPE "public"."enum_guests_rsvp_rehearsal_dinner";
  DROP TYPE "public"."enum_guests_rsvp_wedding_day";
  DROP TYPE "public"."enum_guests_rsvp_pool_day";
  DROP TYPE "public"."enum_guests_transportation_to_venue";
  DROP TYPE "public"."enum_guests_transportation_from_venue";
  DROP TYPE "public"."enum_guests_meal_preference";
  DROP TYPE "public"."enum_parties_color";
  DROP TYPE "public"."enum_relations_color";
  DROP TYPE "public"."enum_sides_color";`)
}
