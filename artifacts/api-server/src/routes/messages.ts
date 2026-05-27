import { Router } from "express";
import { db, messagesTable, usersTable, roomsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { SendMessageBody } from "@workspace/api-zod";

const router = Router({ mergeParams: true });

const safeUser = {
  id: usersTable.id,
  username: usersTable.username,
  displayName: usersTable.displayName,
  avatarUrl: usersTable.avatarUrl,
  status: usersTable.status,
  role: usersTable.role,
  createdAt: usersTable.createdAt,
};

router.get("/", async (req, res) => {
  const roomId = parseInt((req.params as any).id);
  const msgs = await db.select({
    id: messagesTable.id,
    roomId: messagesTable.roomId,
    userId: messagesTable.userId,
    content: messagesTable.content,
    type: messagesTable.type,
    fileUrl: messagesTable.fileUrl,
    fileName: messagesTable.fileName,
    mimeType: messagesTable.mimeType,
    createdAt: messagesTable.createdAt,
    user: safeUser,
  }).from(messagesTable)
    .leftJoin(usersTable, eq(messagesTable.userId, usersTable.id))
    .where(eq(messagesTable.roomId, roomId))
    .orderBy(desc(messagesTable.createdAt))
    .limit(50);
  res.json(msgs.reverse());
});

router.post("/", async (req, res) => {
  const roomId = parseInt((req.params as any).id);
  const parsed = SendMessageBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const userId = (req as any).session?.userId ?? 1;

  const [msg] = await db.insert(messagesTable).values({
    roomId,
    userId,
    content: parsed.data.content,
    type: parsed.data.type ?? "text",
    fileUrl: parsed.data.fileUrl ?? null,
    fileName: parsed.data.fileName ?? null,
    mimeType: parsed.data.mimeType ?? null,
  }).returning();

  await db.update(roomsTable).set({ lastMessageAt: new Date() }).where(eq(roomsTable.id, roomId));

  const [user] = await db.select(safeUser).from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  res.status(201).json({ ...msg, user: user ?? null });
});

export default router;
