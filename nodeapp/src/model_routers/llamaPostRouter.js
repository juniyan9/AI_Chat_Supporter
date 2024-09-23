import express from "express";
import bodyParser from "body-parser"
import llama_run from "./generateContentLlama.js";

let app = express();
const llamaPostRouter = express.Router();

app.use(express.json()); //json 파일 처리

// 방 목록 갱신
// llamaPostRouter.post("/", async (req, res) => {
//   // console.log(req.body.message)

//   const prompt = req.body.message;
//   console.log(prompt)

//   const LLMRes = await llama_run(prompt);
//   console.log(LLMRes)

//   res.send({ LLMRes: LLMRes });
// });

// export default llamaPostRouter;

llamaPostRouter.post("/", async (req, res) => {
  // console.log(req.body.message)
  const LLMRes = await llama_run(req);
  console.log('LLMRes', LLMRes)

  res.send({ LLMRes: LLMRes });
});

export default llamaPostRouter;
