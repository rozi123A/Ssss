import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  status: varchar("status", { length: 16 }).notNull().default("offline"),
  role: varchar("role", { length: 16 }).notNull().default("user"),
  openId: varchar("open_id", { length: 128 }).unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
