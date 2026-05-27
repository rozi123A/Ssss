import { Router } from "express";
import { db, roomsTable, roomMembersTable, usersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { CreateRoomBody } from "@workspace/api-zod";

const router = Router();

const safeUser = {
  id: usersTable.id,
  username: usersTable.username,
  displayName: usersTable.displayName,
  avatarUrl: usersTable.avatarUrl,
  status: usersTable.status,
  role: usersTable.role,
  createdAt: usersTable.createdAt,
};

router.get("/", async (_req, res) => {
  const rooms = await db.select().from(roomsTable);
  const roomsWithCounts = await Promise.all(
    rooms.map(async (room) => {
      const [row] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(roomMembersTable)
        .where(eq(roomMembersTable.roomId, room.id));
      return { ...room, memberCount: row?.count ?? 0 };
    })
  );
  res.json(roomsWithCounts);
});

router.post("/", async (req, res) => {
  const parsed = CreateRoomBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const userId = (req as any).session?.userId ?? 1;
  const [room] = await db.insert(roomsTable).values({
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    isPrivate: parsed.data.isPrivate ?? false,
    createdBy: userId,
  }).returning();
  await db.insert(roomMembersTable).values({ roomId: room.id, userId });
  res.status(201).json({ ...room, memberCount: 1 });
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, id)).limit(1);
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }
  const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(roomMembersTable).where(eq(roomMembersTable.roomId, id));
  res.json({ ...room, memberCount: row?.count ?? 0 });
});

router.post("/:id/join", async (req, res) => {
  const roomId = parseInt(req.params.id);
  const userId = (req as any).session?.userId ?? 1;
  const existing = await db.select().from(roomMembersTable)
    .where(eq(roomMembersTable.roomId, roomId)).limit(1);
  if (existing.length === 0) {
    await db.insert(roomMembersTable).values({ roomId, userId });
  }
  res.json({ success: true });
});

router.get("/:id/members", async (req, res) => {
  const roomId = parseInt(req.params.id);
  const members = await db.select({
    id: roomMembersTable.id,
    roomId: roomMembersTable.roomId,
    userId: roomMembersTable.userId,
    joinedAt: roomMembersTable.joinedAt,
    user: safeUser,
  }).from(roomMembersTable)
    .leftJoin(usersTable, eq(roomMembersTable.userId, usersTable.id))
    .where(eq(roomMembersTable.roomId, roomId));
  res.json(members);
});

export default router;
