import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

let app = express();
const geminiAPIrouter = express.Router();

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

geminiAPIrouter.get("/gemini-api", async (req, res) => {
//   const gemini_run = async (prompt) => {
    const story = "알라딘 동화 내용 알려줘.";

    const result = await model.generateContent(story);
    const response = result.response;
    console.log("response ::", response);

    const text = response.text();
    console.log("text ::", text);

    return text;
//   };
});

export default geminiAPIrouter;
