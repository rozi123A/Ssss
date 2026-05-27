import { Router } from "express";
import { db, callsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { InitiateCallBody, UpdateCallStatusBody } from "@workspace/api-zod";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = InitiateCallBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const initiatorId = (req as any).session?.userId ?? 1;
  const [call] = await db.insert(callsTable).values({
    initiatorId,
    recipientId: parsed.data.recipientId,
    callType: parsed.data.callType,
    roomId: parsed.data.roomId ?? null,
    status: "pending",
  }).returning();
  res.status(201).json(call);
});

router.patch("/:id/status", async (req, res) => {
  const id = parseInt(req.params.id);
  const parsed = UpdateCallStatusBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const updateData: Record<string, unknown> = { status: parsed.data.status };
  if (parsed.data.status === "completed") {
    updateData.endedAt = new Date();
    if (parsed.data.duration !== undefined) updateData.duration = parsed.data.duration;
  }
  await db.update(callsTable).set(updateData as any).where(eq(callsTable.id, id));
  res.json({ success: true });
});

export default router;
