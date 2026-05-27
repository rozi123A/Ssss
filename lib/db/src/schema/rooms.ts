import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const roomsTable = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isPrivate: boolean("is_private").notNull().default(false),
  createdBy: integer("created_by").notNull(),
  lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const roomMembersTable = pgTable("room_members", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  userId: integer("user_id").notNull(),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertRoomSchema = createInsertSchema(roomsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRoomMemberSchema = createInsertSchema(roomMembersTable).omit({ id: true });
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type InsertRoomMember = z.infer<typeof insertRoomMemberSchema>;
export type Room = typeof roomsTable.$inferSelect;
export type RoomMember = typeof roomMembersTable.$inferSelect;
