import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  integer,
  boolean,
  uniqueIndex,
  index,
  jsonb,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { sql } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["customer", "admin"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "trialing",
  "past_due",
  "cancelled",
  "incomplete",
  "incomplete_expired",
  "paused",
  "unpaid",
]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "active",
  "cancelled",
  "past_due",
  "trialing",
  "completed",
  "refunded",
]);
export const onboardingStatusEnum = pgEnum("onboarding_status", [
  "pending",
  "in_progress",
  "received",
  "needs_review",
  "ready",
  "live",
  "complete",
  "paused",
  "failed",
]);
export const blogStatusEnum = pgEnum("blog_status", ["draft", "published", "archived"]);
export const supportStatusEnum = pgEnum("support_status", ["open", "in_progress", "resolved", "closed"]);
export const demoStatusEnum = pgEnum("demo_status", ["new", "contacted", "completed", "no_show", "rejected"]);
export const affiliateStatusEnum = pgEnum("affiliate_status", ["pending", "approved", "rejected"]);
export const webhookProcessingStatusEnum = pgEnum("webhook_processing_status", [
  "processing",
  "processed",
  "failed",
]);

// Auth.js v5 tables -----------------------------------------------------------

export const users = pgTable("user", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("password_hash"),
  role: userRoleEnum("role").notNull().default("customer"),
  stripeCustomerId: text("stripe_customer_id").unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    pk: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    pk: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const passwordResetTokens = pgTable(
  "password_reset_token",
  {
    token: text("token").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => ({ userIdx: index("prt_user_idx").on(t.userId) }),
);

// Customer profile ------------------------------------------------------------

export const customerProfiles = pgTable(
  "customer_profile",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    businessName: text("business_name"),
    niche: text("niche"),
    phoneNumber: text("phone_number"),
    website: text("website"),
    calendarConnected: boolean("calendar_connected").notNull().default(false),
    onboardingStatus: onboardingStatusEnum("onboarding_status").notNull().default("pending"),
    onboardingCompletedAt: timestamp("onboarding_completed_at"),
    onboardingData: jsonb("onboarding_data").$type<Record<string, unknown>>(),
    setupStatus: text("setup_status"),
    arohaAiOrgId: text("aroha_ai_org_id"),
    arohaAiLoginUrl: text("aroha_ai_login_url"),
    setupUpdatedAt: timestamp("setup_updated_at"),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
);

// Subscriptions / orders ------------------------------------------------------

export const subscriptions = pgTable(
  "subscription",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
    stripePriceId: text("stripe_price_id").notNull(),
    planId: text("plan_id").notNull(),
    status: subscriptionStatusEnum("status").notNull(),
    currency: text("currency").notNull().default("nzd"),
    amount: integer("amount").notNull(),
    interval: text("interval").notNull().default("month"),
    currentPeriodStart: timestamp("current_period_start"),
    currentPeriodEnd: timestamp("current_period_end"),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    cancelledAt: timestamp("cancelled_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("subs_user_idx").on(t.userId) }),
);

export const orders = pgTable(
  "order",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderNumber: text("order_number").notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subscriptionId: uuid("subscription_id").references(() => subscriptions.id, { onDelete: "set null" }),
    planId: text("plan_id").notNull(),
    planName: text("plan_name").notNull(),
    customerName: text("customer_name"),
    customerEmail: text("customer_email").notNull(),
    businessName: text("business_name"),
    status: orderStatusEnum("status").notNull(),
    currency: text("currency").notNull().default("nzd"),
    amount: integer("amount").notNull(),
    stripeCheckoutSessionId: text("stripe_checkout_session_id"),
    stripeInvoiceId: text("stripe_invoice_id"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    statusIdx: index("orders_status_idx").on(t.status),
    createdIdx: index("orders_created_idx").on(t.createdAt),
  }),
);

// Inbound forms ---------------------------------------------------------------

export const demoBookings = pgTable(
  "demo_booking",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    businessName: text("business_name"),
    email: text("email").notNull(),
    phone: text("phone"),
    industry: text("industry"),
    message: text("message"),
    source: text("source"),
    status: demoStatusEnum("status").notNull().default("new"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({ createdIdx: index("demo_created_idx").on(t.createdAt) }),
);

export const contactMessages = pgTable(
  "contact_message",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    businessName: text("business_name"),
    email: text("email").notNull(),
    phone: text("phone"),
    message: text("message").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
);

export const supportTickets = pgTable(
  "support_ticket",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    status: supportStatusEnum("status").notNull().default("open"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    resolvedAt: timestamp("resolved_at"),
  },
);

// Blog ------------------------------------------------------------------------

export const blogPosts = pgTable(
  "blog_post",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull().default(""),
    category: text("category").notNull().default("guide"),
    coverImage: text("cover_image"),
    author: text("author").notNull().default("Aroha"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    status: blogStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: uniqueIndex("blog_slug_idx").on(t.slug),
    statusIdx: index("blog_status_idx").on(t.status),
  }),
);

// Affiliates ------------------------------------------------------------------

export const affiliateApplications = pgTable("affiliate_application", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  audience: text("audience"),
  channel: text("channel"),
  message: text("message"),
  status: affiliateStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Analytics -------------------------------------------------------------------

export const pageViews = pgTable(
  "page_view",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    path: text("path").notNull(),
    referrer: text("referrer"),
    userAgent: text("user_agent"),
    country: text("country"),
    sessionId: text("session_id"),
    userId: text("user_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    pathIdx: index("page_views_path_idx").on(t.path),
    createdIdx: index("page_views_created_idx").on(t.createdAt),
  }),
);

export const conversionEvents = pgTable(
  "conversion_event",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id"),
    sessionId: text("session_id"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    nameIdx: index("conv_name_idx").on(t.name),
    createdIdx: index("conv_created_idx").on(t.createdAt),
  }),
);

export const stripeWebhookEvents = pgTable("stripe_webhook_event", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  processingStatus: webhookProcessingStatusEnum("processing_status").notNull().default("processing"),
  processingError: text("processing_error"),
  processedAt: timestamp("processed_at").notNull().defaultNow(),
  payload: jsonb("payload").$type<Record<string, unknown>>(),
});

export const arohaAiWebhookEvents = pgTable(
  "aroha_ai_webhook_event",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    direction: text("direction").notNull(),
    eventType: text("event_type").notNull(),
    idempotencyKey: text("idempotency_key").notNull().unique(),
    status: text("status").notNull().default("pending"),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    subscriptionId: uuid("subscription_id").references(() => subscriptions.id, { onDelete: "set null" }),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
    encrypted: boolean("encrypted").notNull().default(false),
    signature: text("signature"),
    nonce: text("nonce"),
    attempts: integer("attempts").notNull().default(0),
    responseStatus: integer("response_status"),
    responseBody: text("response_body"),
    processingError: text("processing_error"),
    nextAttemptAt: timestamp("next_attempt_at"),
    processedAt: timestamp("processed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    directionIdx: index("aroha_ai_webhook_direction_idx").on(t.direction),
    statusIdx: index("aroha_ai_webhook_status_idx").on(t.status),
    eventTypeIdx: index("aroha_ai_webhook_event_type_idx").on(t.eventType),
    createdIdx: index("aroha_ai_webhook_created_idx").on(t.createdAt),
    userIdx: index("aroha_ai_webhook_user_idx").on(t.userId),
  }),
);

export const adminNotes = pgTable(
  "admin_note",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("admin_note_user_idx").on(t.userId),
    createdIdx: index("admin_note_created_idx").on(t.createdAt),
  }),
);

export const emailEvents = pgTable(
  "email_event",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    template: text("template").notNull(),
    recipient: text("recipient").notNull(),
    subject: text("subject").notNull(),
    resendId: text("resend_id"),
    status: text("status").notNull().default("queued"),
    error: text("error"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("email_event_user_idx").on(t.userId),
    templateIdx: index("email_event_template_idx").on(t.template),
    createdIdx: index("email_event_created_idx").on(t.createdAt),
  }),
);

// Retell live demo ------------------------------------------------------------

export const retellDemoCalls = pgTable(
  "retell_demo_call",
  {
    callId: text("call_id").primaryKey(),
    sessionId: text("session_id"),
    agentId: text("agent_id").notNull(),
    agentName: text("agent_name"),
    status: text("status").notNull().default("registered"),
    selectedAccent: text("selected_accent"),
    selectedVoiceId: text("selected_voice_id"),
    transcriptSnippet: text("transcript_snippet"),
    summary: text("summary"),
    sentiment: text("sentiment"),
    detectedIntent: text("detected_intent"),
    bookingMade: boolean("booking_made").notNull().default(false),
    quoteRequested: boolean("quote_requested").notNull().default(false),
    nextAction: text("next_action"),
    durationMs: integer("duration_ms"),
    disconnectionReason: text("disconnection_reason"),
    startedAt: timestamp("started_at"),
    endedAt: timestamp("ended_at"),
    analyzedAt: timestamp("analyzed_at"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    sessionIdx: index("retell_demo_session_idx").on(t.sessionId),
    statusIdx: index("retell_demo_status_idx").on(t.status),
    createdIdx: index("retell_demo_created_idx").on(t.createdAt),
  }),
);

export const retellWebhookEvents = pgTable(
  "retell_webhook_event",
  {
    id: text("id").primaryKey(),
    event: text("event").notNull(),
    callId: text("call_id"),
    processedAt: timestamp("processed_at").notNull().defaultNow(),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
  },
  (t) => ({
    callIdx: index("retell_webhook_call_idx").on(t.callId),
  }),
);

export const invoices = pgTable(
  "invoice",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    stripeInvoiceId: text("stripe_invoice_id").notNull().unique(),
    stripeSubscriptionId: text("stripe_subscription_id"),
    status: text("status").notNull(),
    currency: text("currency").notNull().default("nzd"),
    amountPaid: integer("amount_paid").notNull().default(0),
    amountDue: integer("amount_due").notNull().default(0),
    hostedInvoiceUrl: text("hosted_invoice_url"),
    invoicePdf: text("invoice_pdf"),
    periodStart: timestamp("period_start"),
    periodEnd: timestamp("period_end"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("invoice_user_idx").on(t.userId),
    stripeSubscriptionIdx: index("invoice_sub_idx").on(t.stripeSubscriptionId),
  }),
);

export const subscriptionEvents = pgTable(
  "subscription_event",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    stripeSubscriptionId: text("stripe_subscription_id"),
    type: text("type").notNull(),
    planId: text("plan_id"),
    fromStatus: text("from_status"),
    toStatus: text("to_status"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("sub_event_user_idx").on(t.userId),
    createdIdx: index("sub_event_created_idx").on(t.createdAt),
  }),
);

export const adminSettings = pgTable("admin_setting", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<Record<string, unknown> | string | number | boolean | null>(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const statusServices = pgTable("status_service", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull().default("operational"),
  description: text("description"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type CustomerProfile = typeof customerProfiles.$inferSelect;
export type DemoBooking = typeof demoBookings.$inferSelect;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type PageView = typeof pageViews.$inferSelect;
export type ConversionEvent = typeof conversionEvents.$inferSelect;
export type SubscriptionEvent = typeof subscriptionEvents.$inferSelect;
export type RetellDemoCall = typeof retellDemoCalls.$inferSelect;
export type ArohaAiWebhookEvent = typeof arohaAiWebhookEvents.$inferSelect;
export type AdminNote = typeof adminNotes.$inferSelect;
export type EmailEvent = typeof emailEvents.$inferSelect;
