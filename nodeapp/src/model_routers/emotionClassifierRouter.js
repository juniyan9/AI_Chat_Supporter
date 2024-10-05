import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { analyzeEmotion } from "../model_function/analyzeEmotion.js";

let app = express();
const emotionClassifierRouter = express.Router();


app.use(express.json()); //json 파일 처리


emotionClassifierRouter.post("/", async (req, res) => {
    const userMessage = req.body.message; // 클라이언트에서 메시지를 받음
    console.log("유저 메시지:", userMessage)
  
    try {
        console.log("try문에 들어옴")
        const result = await analyzeEmotion(userMessage);

        const emotionMatch = result.match(/(공포|놀람|분노|슬픔|중립|행복|혐오)/);
        const emotion = emotionMatch ? emotionMatch[0] : "감정 분석 실패"; // 매칭된 감정이 없으면 기본 메시지 사용

        console.log("감정분석 결과:", emotion); // 결과 출력
        res.send({ result: emotion }); 
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: "Error analyzing emotion" });
    }
  });

  export default emotionClassifierRouter;
