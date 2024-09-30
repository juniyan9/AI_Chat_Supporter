/* NodeJS declaration */
import express from "express";
import cookieParser from "cookie-parser";
import customLogger from "./class/customLogger.js";
import path from "path";
import cors from "cors";
import * as url from "url";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

import { socketConnection } from "./inChatRoom/socketConnection.js";
import { userInfo } from "./main_page/main_page.js";
import { removeUser } from "./main_page/sessionUtils.js";
import { extendSession } from "./main_page/sessionUtils.js";

let app = express();
export const logger = new customLogger();

// /* WebSocket declaration */
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, { cors: "*" });

/* NodeJS implementation */

// Set filePath
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

/* middleware */
//app.use('요청 경로', express.static('실제 경로'));


const sessionDurationMin = 15

export const sessionObj = {
  secret: process.env.SECRET_KEY, // 세션을 암호화하는 데 사용되는 비밀 키
  store: new session.MemoryStore({ checkPeriod: 60000 * sessionDurationMin }), //정상 작동.
  resave: false, // 매번 세션 강제 저장
  saveUninitialized: false, // 빈 값도 저장 - empty session obj 쌓이는 거 방지
  cookie: {
    secure: false, // 개발 환경에서는 false, 프로덕션에서는 true로 설정 (HTTPS 필요) true로 하면 방 생성 안 됨
    httpOnly: true, // 클라이언트 측 JavaScript에서 쿠키를 읽을 수 없게 설정
    maxAge: 60000 * sessionDurationMin, //sameSite: 'none' --> 방 생성 안 됨
  },
};
app.use(session(sessionObj));

app.use(cookieParser());
app.use(express.json());
//세션 미들웨어가 express의 다른 미들웨어보다 먼저 설정돼야함
//세션 생성해주는 미들웨어

// app.use(cors({ cors: "*" }));
app.use(
  cors({
    origin: "http://localhost:3000",// 클라이언트 도메인
    credentials: true, // 쿠키와 자격 증명을 포함
  })
);

app.use("/", express.static(path.join(__dirname, "reactapp/build")));
// app.use('/', express.static(__dirname));

app.use(express.urlencoded({ extended: true }));

/* // router변수 정리 // */
import userRegisterRouter from "./main_page/main_page.js";
import getRoomListRouter from "./lobby/roomList.js";
import addRoomRouter from "./lobby/addRoom.js";
import updateRoomDataRouter from "./lobby/updateRoom.js";
import deleteRoomRouter from "./inChatRoom/deleteRoom.js";
import geminiPostRouter from "./model_routers/geminiPostRouter.js";
import geminiGetRouter from "./model_routers/geminiGetRouter.js";
import llamaPostRouter from "./model_routers/llamaPostRouter.js";


// 유저 세션 연장 처리
// const extendPrd = 17
// setInterval(() => {
//   const now = new Date();

//   // console.log("세션연장처리 userInfo 배열 내용:", userInfo);  //잘 가져옴

//   userInfo.forEach((userCheck) => {
//     const user = userCheck.user;
//     // console.log("세션연장처리 세션 만료 시간 값 확인:", user.sessionExpiresAt);

//     const sessionExpiresAt = new Date(user.sessionExpiresAt);

//     if (user.socketId && now > sessionExpiresAt) {
//       extendSession(user);
//       logger.info("세션 연장 처리 완료");
//     }
//   });
// }, extendPrd * 60000); //17분마다 연장



// 유저 세션 삭제 처리
const delPrd = 5
setInterval(() => {
  const now = new Date();

  userInfo.forEach((userCheck) => {
    const user = userCheck.user;

    // socket.id가 없고 sessionExpiresAt이 5분 지난 경우
    if (!user.socketId && now - new Date(user.sessionExpiresAt) > (60000 * 5)) {
      removeUser(user);
    }
  });
}, delPrd * 60000); //5분마다 삭제작업




/*main page*/
app.get("/", (req, res) => {
  res.readFile("index.html");
});

app.post("/post", (req, res) => {
  const msg = req.body.message;

  res.send({ return: msg });
});

//유저 등록
app.use("/register", userRegisterRouter);

/*lobby*/
// 방 만들기 및 설정 저장
app.use("/add_room", addRoomRouter);
// 방 설정 업데이트
app.use("/update_room", updateRoomDataRouter);
// 방 목록 갱신
app.use("/rooms", getRoomListRouter);
//방 삭제
app.use("/delete_room", deleteRoomRouter);

/*Inside Chat Room*/
socketConnection();


/* 모델 호출 */

// spawn을 통해 "python 파이썬파일.py" 명령어 실행
// import { spawnOne } from "./AI_model/spawnOne.js";
// spawnOne();

//Gemini API 호출
// app.use("/gemini-api", geminiAPIrouter);

//Gemini POST route
app.use("/gemini", geminiPostRouter);

//Gemini GET route
app.use("/gemini/:id", geminiGetRouter);

// llama POST route
app.use("/api/chat", llamaPostRouter);


export { app, io };
