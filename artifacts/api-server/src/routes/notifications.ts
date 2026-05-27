import { Router } from "express";
import { db, notificationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const userId = (req as any).session?.userId ?? 1;
  const notes = await db.select().from(notificationsTable)
    .where(eq(notificationsTable.userId, userId))
    .orderBy(desc(notificationsTable.createdAt))
    .limit(50);
  res.json(notes);
});

router.patch("/:id/read", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.update(notificationsTable).set({ isRead: true }).where(eq(notificationsTable.id, id));
  res.json({ success: true });
});

export default router;
