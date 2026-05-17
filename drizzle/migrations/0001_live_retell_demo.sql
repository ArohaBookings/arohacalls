CREATE TYPE "webhook_processing_status" AS ENUM('processing', 'processed', 'failed');
--> statement-breakpoint
ALTER TABLE "stripe_webhook_event" ADD COLUMN "processing_status" "webhook_processing_status" DEFAULT 'processed' NOT NULL;
--> statement-breakpoint
ALTER TABLE "stripe_webhook_event" ADD COLUMN "processing_error" text;
--> statement-breakpoint
ALTER TABLE "stripe_webhook_event" ALTER COLUMN "processing_status" SET DEFAULT 'processing';
--> statement-breakpoint
CREATE TABLE "retell_demo_call" (
	"call_id" text PRIMARY KEY NOT NULL,
	"session_id" text,
	"agent_id" text NOT NULL,
	"agent_name" text,
	"status" text DEFAULT 'registered' NOT NULL,
	"selected_accent" text,
	"selected_voice_id" text,
	"transcript_snippet" text,
	"summary" text,
	"sentiment" text,
	"detected_intent" text,
	"booking_made" boolean DEFAULT false NOT NULL,
	"quote_requested" boolean DEFAULT false NOT NULL,
	"next_action" text,
	"duration_ms" integer,
	"disconnection_reason" text,
	"started_at" timestamp,
	"ended_at" timestamp,
	"analyzed_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "retell_webhook_event" (
	"id" text PRIMARY KEY NOT NULL,
	"event" text NOT NULL,
	"call_id" text,
	"processed_at" timestamp DEFAULT now() NOT NULL,
	"payload" jsonb
);
--> statement-breakpoint
CREATE INDEX "retell_demo_session_idx" ON "retell_demo_call" USING btree ("session_id");
--> statement-breakpoint
CREATE INDEX "retell_demo_status_idx" ON "retell_demo_call" USING btree ("status");
--> statement-breakpoint
CREATE INDEX "retell_demo_created_idx" ON "retell_demo_call" USING btree ("created_at");
--> statement-breakpoint
CREATE INDEX "retell_webhook_call_idx" ON "retell_webhook_event" USING btree ("call_id");
