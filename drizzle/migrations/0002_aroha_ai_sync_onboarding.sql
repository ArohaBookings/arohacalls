ALTER TYPE "public"."onboarding_status" ADD VALUE IF NOT EXISTS 'received';
--> statement-breakpoint
ALTER TYPE "public"."onboarding_status" ADD VALUE IF NOT EXISTS 'needs_review';
--> statement-breakpoint
ALTER TYPE "public"."onboarding_status" ADD VALUE IF NOT EXISTS 'ready';
--> statement-breakpoint
ALTER TYPE "public"."onboarding_status" ADD VALUE IF NOT EXISTS 'complete';
--> statement-breakpoint
ALTER TYPE "public"."onboarding_status" ADD VALUE IF NOT EXISTS 'failed';
--> statement-breakpoint
ALTER TABLE "customer_profile" ADD COLUMN "onboarding_data" jsonb;
--> statement-breakpoint
ALTER TABLE "customer_profile" ADD COLUMN "setup_status" text;
--> statement-breakpoint
ALTER TABLE "customer_profile" ADD COLUMN "aroha_ai_org_id" text;
--> statement-breakpoint
ALTER TABLE "customer_profile" ADD COLUMN "aroha_ai_login_url" text;
--> statement-breakpoint
ALTER TABLE "customer_profile" ADD COLUMN "setup_updated_at" timestamp;
--> statement-breakpoint
CREATE TABLE "aroha_ai_webhook_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"direction" text NOT NULL,
	"event_type" text NOT NULL,
	"idempotency_key" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"user_id" text,
	"subscription_id" uuid,
	"payload" jsonb,
	"encrypted" boolean DEFAULT false NOT NULL,
	"signature" text,
	"nonce" text,
	"attempts" integer DEFAULT 0 NOT NULL,
	"response_status" integer,
	"response_body" text,
	"processing_error" text,
	"next_attempt_at" timestamp,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "aroha_ai_webhook_event_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "admin_note" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"author_id" text,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"template" text NOT NULL,
	"recipient" text NOT NULL,
	"subject" text NOT NULL,
	"resend_id" text,
	"status" text DEFAULT 'queued' NOT NULL,
	"error" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "aroha_ai_webhook_event" ADD CONSTRAINT "aroha_ai_webhook_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "aroha_ai_webhook_event" ADD CONSTRAINT "aroha_ai_webhook_event_subscription_id_subscription_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscription"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "admin_note" ADD CONSTRAINT "admin_note_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "admin_note" ADD CONSTRAINT "admin_note_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "email_event" ADD CONSTRAINT "email_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "aroha_ai_webhook_direction_idx" ON "aroha_ai_webhook_event" USING btree ("direction");
--> statement-breakpoint
CREATE INDEX "aroha_ai_webhook_status_idx" ON "aroha_ai_webhook_event" USING btree ("status");
--> statement-breakpoint
CREATE INDEX "aroha_ai_webhook_event_type_idx" ON "aroha_ai_webhook_event" USING btree ("event_type");
--> statement-breakpoint
CREATE INDEX "aroha_ai_webhook_created_idx" ON "aroha_ai_webhook_event" USING btree ("created_at");
--> statement-breakpoint
CREATE INDEX "aroha_ai_webhook_user_idx" ON "aroha_ai_webhook_event" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "admin_note_user_idx" ON "admin_note" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "admin_note_created_idx" ON "admin_note" USING btree ("created_at");
--> statement-breakpoint
CREATE INDEX "email_event_user_idx" ON "email_event" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "email_event_template_idx" ON "email_event" USING btree ("template");
--> statement-breakpoint
CREATE INDEX "email_event_created_idx" ON "email_event" USING btree ("created_at");
