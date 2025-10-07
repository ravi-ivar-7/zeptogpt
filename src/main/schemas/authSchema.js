import { pgTable, text, timestamp, boolean, jsonb, uuid, index, varchar } from 'drizzle-orm/pg-core'
 
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password'), // Nullable for OAuth users - bcrypt hashed
  name: varchar('name', { length: 255 }),
  image: text('image'),
  emailVerified: timestamp('email_verified', { withTimezone: true }), // When email was verified (null = not verified)
  isActive: boolean('is_active').default(false).notNull(), // Account access control (true = can access, false = suspended/disabled)
  role: varchar('role', { length: 50 }).default('user').notNull(),
  twoFactorEnabled: boolean('two_factor_enabled').default(false).notNull(),
  locale: varchar('locale', { length: 10 }).default('en'),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),
  lastSignIn: timestamp('last_sign_in', { withTimezone: true }),
  passwordChangedAt: timestamp('password_changed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  activeUsersIdx: index('users_active_idx').on(table.isActive),
}));


export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: varchar('provider', { length: 50 }).notNull(), // google, github, etc.
  providerId: varchar('provider_id', { length: 255 }).notNull(), // e.g., Google internal user ID
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(), // Redundant but commonly used
  tokenType: varchar('token_type', { length: 50 }), // optional if needed for audit
  scope: text('scope'), // optional
  idToken: text('id_token'), // optional
  sessionState: varchar('session_state', { length: 255 }), // optional
  metadata: jsonb('metadata'), // optional structured provider data
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  providerIdx: index('accounts_provider_idx').on(table.provider, table.providerId),
  userIdx: index('accounts_user_idx').on(table.userId),
  providerUserIdx: index('accounts_provider_user_idx').on(table.provider, table.userId),
}));



// Email Verification Tokens - Production ready
export const verificationTokens = pgTable('verification_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  type: varchar('type', { length: 50 }).notNull(), // 'account_activation_otp', 'email_verification_otp', '2fa_otp', 'password_reset_otp'
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  isUsed: boolean('is_used').default(false).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  ipAddress: varchar('ip_address', { length: 45 }), // Track where token was used
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  tokenIdx: index('verification_tokens_token_idx').on(table.token),
  typeIdx: index('verification_tokens_type_idx').on(table.type),
  expiresIdx: index('verification_tokens_expires_idx').on(table.expiresAt),
}))

// User Sessions for tracking active sessions 
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  sessionToken: varchar('session_token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  deviceInfo: text('device_info'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  isActive: boolean('is_active').default(true).notNull(),
  lastAccessedAt: timestamp('last_accessed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  sessionTokenIdx: index('sessions_token_idx').on(table.sessionToken),
  userIdx: index('sessions_user_idx').on(table.userId),
  activeSessionsIdx: index('sessions_active_idx').on(table.isActive, table.expiresAt),
  lastAccessIdx: index('sessions_last_access_idx').on(table.lastAccessedAt),
}))
