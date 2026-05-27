import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/me", async (req, res) => {
  const userId = (req as any).session?.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const [user] = await db.select({
    id: usersTable.id,
    username: usersTable.username,
    displayName: usersTable.displayName,
    avatarUrl: usersTable.avatarUrl,
    status: usersTable.status,
    role: usersTable.role,
    createdAt: usersTable.createdAt,
  }).from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user) { res.status(401).json({ error: "User not found" }); return; }
  res.json(user);
});

router.post("/logout", (req, res) => {
  (req as any).session = null;
  res.json({ success: true });
});

export default router;
