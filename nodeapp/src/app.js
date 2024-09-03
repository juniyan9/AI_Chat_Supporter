/* NodeJS declaration */
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import customLogger from "./class/customLogger.js";
import userObj from "./class/user.js";
import roomObj from "./class/room.js";
import path from "path";
import cors from "cors";
import * as url from "url";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

import { socketConnection } from "./inChatRoom/socketConnection.js";
import { removeUser, sessionObj } from "./main_page/main_page.js";
import { userInfo } from "./main_page/main_page.js";

let app = express();
export const logger = new customLogger();

// /* WebSocket declaration */
import { createServer } from "http";
import { Server } from "socket.io";
// import user from "./class/user.js";

const httpServer = createServer();
const io = new Server(httpServer, { cors: "*" });
// const io = new Server(httpServer, {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

// const corsOptions = {
//   origin: 'http://localhost:3000', 'http://localhost:5000', // React 앱이 실행되는 URL, 리액트로 띄워야함.. 근데도 왜 세션에 담긴 사용자 정보 안 뜸..?
//   methods: ['GET', 'POST'],
//   credentials: true, // 세션 쿠키를 포함시키기 위해 필요
// };

/* NodeJS implementation */

// Set filePath
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

/* middleware */
//app.use('요청 경로', express.static('실제 경로'));

//세션 미들웨어가 express의 다른 미들웨어보다 먼저 설정돼야함
//세션 생성해주는 미들웨어
app.use(session(sessionObj));
// app.use(cors(corsOptions));

// 세션 만료 시 유저 삭제 --> TypeError: Cannot read properties of undefined (reading 'user')
// app.use((req, res, next) => {
//   if (req.session.user) {
//     next();
//   } else {
//     removeUser(req.session.user.nickName);
//     res.status(401).send("세션이 존재하지 않습니다.");
//     console.log("세션을 삭제함.")
//   }
// });

app.use("/", express.static(path.join(__dirname, "reactapp/build")));
// app.use('/', express.static(__dirname));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ cors: "*" }));

app.use(cookieParser());

/* // router변수 정리 // */
import userRegisterRouter from "./main_page/main_page.js";
import getRoomListRouter from "./lobby/roomList.js";
import addRoomRouter from "./lobby/addRoom.js";
import updateRoomDataRouter from "./lobby/updateRoom.js";

/*main page*/
app.get("/", (req, res) => {
  res.readFile("index.html");
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

/*Inside Chat Room*/
socketConnection(io);

// import { spawn } from 'child_process';


// spawn을 통해 "python 파이썬파일.py" 명령어 실행
// function spawnOne () {
//   const result = spawn('py', ['./model_call.py', 'param1']);

//   // stdout의 'data' 이벤트 리스너로 실행 결과를 받는다.
//   result.stdout.on('data', (data) => {
//       console.log("111", data.toString());
//   });

//   // 에러 발생 시, stderr의 'data' 이벤트 리스너로 실행 결과를 받는다.
//   result.stderr.on('data', (data) => {
//       console.log("222", data.toString());
//   });
// }

// spawnOne();

export { app, io };
