import { mysqlTable, varchar, text, decimal, timestamp, boolean, index } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Users Table (Manus OAuth)
export const users = mysqlTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'), // 14-day beta expiry
  paymentActive: boolean('payment_active').default(false),
  industry: varchar('industry', { length: 100 }),
  company: varchar('company', { length: 255 }),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
  expiresIdx: index('expires_idx').on(table.expiresAt),
}));

// AEO Analyses Table
export const aeoAnalyses = mysqlTable('aeo_analyses', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  url: varchar('url', { length: 2048 }).notNull(),
  industry: varchar('industry', { length: 100 }),
  overallScore: decimal('overall_score', { precision: 4, scale: 2 }).notNull(),
  contentQualityScore: decimal('content_quality_score', { precision: 4, scale: 2 }),
  technicalSeoScore: decimal('technical_seo_score', { precision: 4, scale: 2 }),
  authorityScore: decimal('authority_score', { precision: 4, scale: 2 }),
  chatVisibilityScore: decimal('chat_visibility_score', { precision: 4, scale: 2 }),
  recommendations: text('recommendations'), // JSON string
  competitorGap: decimal('competitor_gap', { precision: 4, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
  urlIdx: index('url_idx').on(table.url),
}));

// Page Visits Table (Analytics)
export const pageVisits = mysqlTable('page_visits', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  pagePath: varchar('page_path', { length: 500 }).notNull(),
  referrer: varchar('referrer', { length: 2048 }),
  device: varchar('device', { length: 100 }),
  browser: varchar('browser', { length: 100 }),
  country: varchar('country', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pagePathIdx: index('page_path_idx').on(table.pagePath),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
}));

// Conversions Table (Lead Capture)
export const conversions = mysqlTable('conversions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  type: varchar('type', { length: 50 }).notNull(), // 'lead_magnet', 'consultation', 'pricing'
  email: varchar('email', { length: 255 }),
  company: varchar('company', { length: 255 }),
  aeoScore: decimal('aeo_score', { precision: 4, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  typeIdx: index('type_idx').on(table.type),
  userIdIdx: index('conv_user_id_idx').on(table.userId),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  analyses: many(aeoAnalyses),
  visits: many(pageVisits),
  conversions: many(conversions),
}));

export const aeoAnalysesRelations = relations(aeoAnalyses, ({ one }) => ({
  user: one(users, {
    fields: [aeoAnalyses.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AeoAnalysis = typeof aeoAnalyses.$inferSelect;
export type NewAeoAnalysis = typeof aeoAnalyses.$inferInsert;
export type PageVisit = typeof pageVisits.$inferSelect;
export type NewPageVisit = typeof pageVisits.$inferInsert;
export type Conversion = typeof conversions.$inferSelect;
export type NewConversion = typeof conversions.$inferInsert;
