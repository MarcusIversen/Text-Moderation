DO $$ BEGIN
 CREATE TYPE "moderation_type_enum" AS ENUM('badWord', 'negative', 'nsfw', 'sexual', 'hate', 'violence', 'harassment', 'sexual/minors', 'hate/threatening', 'violence/graphic', 'personalInfo');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "status_type" ADD VALUE 'unclassifiable';--> statement-breakpoint
ALTER TYPE "type_enum" ADD VALUE 'AI';--> statement-breakpoint
ALTER TYPE "type_enum" ADD VALUE 'Manual';--> statement-breakpoint
ALTER TABLE "Log" ALTER COLUMN "TextInputID" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Log" ALTER COLUMN "log_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Log" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Log" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Log" ADD COLUMN "moderation_type" "moderation_type_enum" NOT NULL;--> statement-breakpoint
ALTER TABLE "Log" ADD CONSTRAINT "Log_ID_unique" UNIQUE("ID");