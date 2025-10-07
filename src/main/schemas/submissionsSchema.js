import { pgTable, text, timestamp, boolean, jsonb, uuid, index, varchar, pgEnum } from 'drizzle-orm/pg-core'

// Enum for submission types
export const submissionTypeEnum = pgEnum('submission_type', [
  'bug_report',
  'feedback', 
  'email_subscription',
  'feature_request',
  'general'
])

// Enum for submission status
export const submissionStatusEnum = pgEnum('submission_status', [
  'pending',
  'reviewed',
  'in_progress', 
  'resolved',
  'closed'
])

// Submissions table
export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: submissionTypeEnum('type').notNull(),
  status: submissionStatusEnum('status').notNull().default('pending'),
  
  // Contact info
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }),
  
  // Content
  subject: varchar('subject', { length: 500 }),
  message: text('message'),
  
  // Flexible metadata for type-specific data
  metadata: jsonb('metadata').default('{}'),
  
  // File attachments (array of objects)
  attachments: jsonb('attachments').default('[]'),
  
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  typeIdx: index('submissions_type_idx').on(table.type),
  statusIdx: index('submissions_status_idx').on(table.status),
  emailIdx: index('submissions_email_idx').on(table.email),
  createdAtIdx: index('submissions_created_at_idx').on(table.createdAt),
}))
