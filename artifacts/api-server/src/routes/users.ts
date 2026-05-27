import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateUserStatusBody } from "@workspace/api-zod";

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
  const users = await db.select(safeUser).from(usersTable);
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [user] = await db.select(safeUser).from(usersTable).where(eq(usersTable.id, id)).limit(1);
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json(user);
});

router.patch("/status", async (req, res) => {
  const parsed = UpdateUserStatusBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const userId = (req as any).session?.userId ?? 1;
  await db.update(usersTable).set({ status: parsed.data.status }).where(eq(usersTable.id, userId));
  res.json({ success: true });
});

export default router;
