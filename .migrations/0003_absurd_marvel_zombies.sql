ALTER TABLE "projections" RENAME COLUMN "expected_value" TO "actual_income";--> statement-breakpoint
ALTER TABLE "projections" ALTER COLUMN "actual_income" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "value" TYPE real USING value::real;
ALTER TABLE "projections" ADD COLUMN "expected_income" real NOT NULL;--> statement-breakpoint
ALTER TABLE "projections" ADD COLUMN "actual_outcome" real NOT NULL;--> statement-breakpoint
ALTER TABLE "projections" DROP COLUMN IF EXISTS "actual_value";