import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import roomsRouter from "./rooms";
import messagesRouter from "./messages";
import notificationsRouter from "./notifications";
import callsRouter from "./calls";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/rooms", roomsRouter);
router.use("/rooms/:id/messages", messagesRouter);
router.use("/notifications", notificationsRouter);
router.use("/calls", callsRouter);
router.use("/stats", statsRouter);

export default router;
