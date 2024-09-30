import { spawn } from "child_process";
import path from "path";
import * as url from "url";

import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, { cors: "*" });

// Set filePath
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export const analyzeSentiment = (message) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn("python3", [path.join(__dirname, "../ai_model/SentimentClassifier/SentimentClassifier.py"), message]);

        let outputData = '';

        pythonProcess.stdout.on("data", (data) => {
            outputData += data.toString().trim() + "\n";  // 개행문자 기준으로 outputData에 계속 넣음
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error(data.toString());
        });

        pythonProcess.on("close", (code) => {
            if (code !== 0) {
                reject(`Child process exited with code ${code}`);
            } else {
                resolve(outputData.toString().trim());
            }
        });
    });
};