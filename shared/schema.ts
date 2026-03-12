import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("collaborator"),
  department: text("department"),
});

// DEBT: Legacy check-in table — kept for backward compat with existing seed data [remove after migration]
export const checkIns = pgTable("check_ins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  humor: text("humor").notNull(),
  energy: text("energy").notNull(),
  mind: text("mind").notNull(),
  sleep: text("sleep").notNull(),
  contextTags: text("context_tags").array(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// New 3-moment EMA check-in (morning / midday / endday)
export const momentCheckIns = pgTable("moment_check_ins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  moment: text("moment").notNull(), // "morning" | "midday" | "endday"
  answers: text("answers").notNull(), // JSON string: Record<stepId, selectedOptionId | selectedOptionIds[]>
  scores: text("scores").notNull(), // JSON string: Record<stepId, number>
  flags: text("flags").array(), // Aggregated risk flags from all answers
  chatTriggered: boolean("chat_triggered").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const incidentReports = pgTable("incident_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  category: text("category").notNull(),
  subcategory: text("subcategory").notNull(),
  description: text("description"),
  anonymous: boolean("anonymous").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
  department: true,
});

export const insertCheckInSchema = createInsertSchema(checkIns).pick({
  userId: true,
  humor: true,
  energy: true,
  mind: true,
  sleep: true,
  contextTags: true,
  notes: true,
});

export const insertMomentCheckInSchema = createInsertSchema(momentCheckIns).pick({
  userId: true,
  moment: true,
  answers: true,
  scores: true,
  flags: true,
  chatTriggered: true,
});

export const insertIncidentReportSchema = createInsertSchema(incidentReports).pick({
  userId: true,
  category: true,
  subcategory: true,
  description: true,
  anonymous: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCheckIn = z.infer<typeof insertCheckInSchema>;
export type CheckIn = typeof checkIns.$inferSelect;
export type InsertMomentCheckIn = z.infer<typeof insertMomentCheckInSchema>;
export type MomentCheckIn = typeof momentCheckIns.$inferSelect;
export type InsertIncidentReport = z.infer<typeof insertIncidentReportSchema>;
export type IncidentReport = typeof incidentReports.$inferSelect;
