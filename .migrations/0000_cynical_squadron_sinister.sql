CREATE TABLE IF NOT EXISTS "projections" (
	"id" text PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"expected_income" real NOT NULL,
	"actual_income" real NOT NULL,
	"actual_outcome" real NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"value" real NOT NULL,
	"installments" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ends_at" timestamp with time zone,
	"type" text NOT NULL
);
