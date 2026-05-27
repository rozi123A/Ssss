import { pgTable, serial, timestamp, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const callsTable = pgTable("calls", {
  id: serial("id").primaryKey(),
  initiatorId: integer("initiator_id").notNull(),
  recipientId: integer("recipient_id").notNull(),
  callType: varchar("call_type", { length: 16 }).notNull(),
  status: varchar("status", { length: 16 }).notNull().default("pending"),
  duration: integer("duration"),
  roomId: integer("room_id"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCallSchema = createInsertSchema(callsTable).omit({ id: true, createdAt: true });
export type InsertCall = z.infer<typeof insertCallSchema>;
export type Call = typeof callsTable.$inferSelect;
