import express from "express";

let app = express();
const geminiGetRouter = express.Router();

app.use(express.json()); //json 파일 처리

// 방 목록 갱신
geminiGetRouter.get("/", async (req, res) => {
  const LLMRes = await gemini_run(req.params.id);

  res.send({ 'LLMRes' : LLMRes});
});

export default geminiGetRouter;
