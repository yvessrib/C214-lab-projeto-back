import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const transactions = pgTable('transacions', {
  id: text('id')
   .primaryKey()
   .$defaultFn(() => createId()),
  title: text('title').notNull(),
  description: text('description').notNull(),
  value: text('value').notNull(),
  installments: integer('installments').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  endsAt: timestamp('ends_at', { withTimezone: true })
    .notNull(),
  type: text('type').notNull(),
})