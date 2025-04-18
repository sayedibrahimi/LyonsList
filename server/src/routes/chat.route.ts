import express from "express";
const router: express.Router = express.Router();
import {
  createMessage,
  createChat,
  getChatById,
  getAllUsersChats,
} from "../controllers/chat.controller";

router.post("/message", createMessage);

router.post("/", createChat);
router.get("/all", getAllUsersChats);
router.get("/:id", getChatById);

export default router;
