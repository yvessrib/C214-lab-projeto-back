import { pgTable, text, timestamp, integer, real } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import { numeric } from 'drizzle-orm/pg-core'

export const transactions = pgTable('transactions', {
  id: text('id')
   .primaryKey()
   .$defaultFn(() => createId()),
  title: text('title').notNull(),
  description: text('description').notNull(),
  value: real('value').notNull(),
  installments: integer('installments').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
  type: text('type').notNull(),
})

export const projections = pgTable('projections', {
  id: text('id')
   .primaryKey()
   .$defaultFn(() => createId()),
  year: integer('year').notNull(),
  month: integer('month').notNull(),
  expectedIncome: real('expected_income').notNull(),
  actualIncome: real('actual_income').notNull(),
  actualOutcome: real('actual_outcome').notNull(),
  createdAt: timestamp('created_at', {withTimezone: true}).notNull().defaultNow(),
})