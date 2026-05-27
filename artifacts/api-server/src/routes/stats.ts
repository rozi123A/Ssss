import { Router } from "express";
import { db, usersTable, roomsTable, messagesTable } from "@workspace/db";
import { eq, sql, desc } from "drizzle-orm";

const router = Router();

router.get("/dashboard", async (_req, res) => {
  const [{ totalUsers }] = await db.select({ totalUsers: sql<number>`count(*)::int` }).from(usersTable);
  const [{ onlineUsers }] = await db.select({ onlineUsers: sql<number>`count(*)::int` }).from(usersTable).where(eq(usersTable.status, "online"));
  const [{ totalRooms }] = await db.select({ totalRooms: sql<number>`count(*)::int` }).from(roomsTable);
  const [{ totalMessages }] = await db.select({ totalMessages: sql<number>`count(*)::int` }).from(messagesTable);

  const recentMessages = await db.select({
    content: messagesTable.content,
    createdAt: messagesTable.createdAt,
  }).from(messagesTable).orderBy(desc(messagesTable.createdAt)).limit(5);

  const recentActivity = recentMessages.map((m) => ({
    type: "message",
    description: m.content.slice(0, 60),
    createdAt: m.createdAt,
  }));

  res.json({
    totalUsers: totalUsers ?? 0,
    onlineUsers: onlineUsers ?? 0,
    totalRooms: totalRooms ?? 0,
    totalMessages: totalMessages ?? 0,
    recentActivity,
  });
});

export default router;
