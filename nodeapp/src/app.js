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

import { socketConnection } from "./inChatRoom/socketConnection.js";

let app = express();

export const logger = new customLogger();

// /* WebSocket declaration */
import { createServer } from "http";
import { Server } from "socket.io";
// import user from "./class/user.js";

const httpServer = createServer();
const io = new Server(httpServer, { cors: "*" });

/* NodeJS implementation */

// Set filePath
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

/* middleware */
//app.use('요청 경로', express.static('실제 경로'));

app.use("/", express.static(path.join(__dirname, "reactapp/build")));
// app.use('/', express.static(__dirname));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ cors: "*" }));

app.use(cookieParser());

/* // router변수 정리 // */
import userRegisterRouter from './main_page/main_page.js'
import getRoomListRouter from './lobby/roomList.js';
import addRoomRouter from './lobby/addRoom.js';
import updateRoomDataRouter from './lobby/updateRoom.js';

/*main page*/
app.get("/", (req, res) => {
  res.readFile("index.html");
});

//유저 등록 
app.use("/register", userRegisterRouter)


/*lobby*/
// 방 만들기 및 설정 저장
app.use("/add_room", addRoomRouter)
// 방 설정 업데이트
app.use("/update_room", updateRoomDataRouter)
// 방 목록 갱신 
app.use("/rooms", getRoomListRouter)


/*Inside Chat Room*/
socketConnection(io);

export { app, io };
