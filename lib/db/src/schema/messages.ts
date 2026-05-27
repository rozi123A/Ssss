import { pgTable, serial, text, timestamp, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  type: varchar("type", { length: 16 }).notNull().default("text"),
  fileUrl: text("file_url"),
  fileName: varchar("file_name", { length: 255 }),
  mimeType: varchar("mime_type", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertMessageSchema = createInsertSchema(messagesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messagesTable.$inferSelect;
