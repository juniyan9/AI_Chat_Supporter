import express from "express";
import dotenv from "dotenv";
dotenv.config();
import gemini_run from "./gemini.js";

let app = express();
const geminiPostRouter = express.Router();

app.use(express.json()); //json 파일 처리

// 방 목록 갱신
geminiPostRouter.post("/", async (req, res) => {
  const LLMRes = await gemini_run(req.body.message);

  res.send({ LLMRes: LLMRes });
});

export default geminiPostRouter;
