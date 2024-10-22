CREATE TABLE IF NOT EXISTS "projections" (
	"id" text PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"expected_value" numeric NOT NULL,
	"actual_value" numeric,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
