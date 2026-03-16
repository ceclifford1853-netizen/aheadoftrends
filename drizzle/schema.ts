import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Leads table for capturing email submissions from the Alpha Rating form.
 * Stores user-submitted website URLs and email addresses.
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  websiteUrl: varchar("websiteUrl", { length: 2048 }).notNull(),
  industry: varchar("industry", { length: 256 }),
  companyName: varchar("companyName", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * AEO Scores table for storing the 4-factor weighted scoring results.
 * Tracks Quality (40%), SEO (25%), Authority (20%), Visibility (15%).
 */
export const aeoScores = mysqlTable("aeoScores", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  websiteUrl: varchar("websiteUrl", { length: 2048 }).notNull(),
  qualityScore: int("qualityScore").notNull(), // 0-10
  seoScore: int("seoScore").notNull(), // 0-10
  authorityScore: int("authorityScore").notNull(), // 0-10
  visibilityScore: int("visibilityScore").notNull(), // 0-10
  overallScore: int("overallScore").notNull(), // 0-10 weighted
  recommendations: text("recommendations"), // JSON string of recommendations
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AeoScore = typeof aeoScores.$inferSelect;
export type InsertAeoScore = typeof aeoScores.$inferInsert;