import express from "express";
import cookieParser from "cookie-parser";

let app = express();
const getRoomListRouter = express.Router();

app.use(express.json()); //json 파일 처리

import { rooms } from "./addRoom.js";
import { userInfo } from "../main_page/main_page.js";
import { removeUser } from "../main_page/sessionUtils.js";

app.use(cookieParser());

// 방 목록 갱신
getRoomListRouter.get("/", (req, res) => {

  // console.log("getRoomListRouter, session check:", req.session.user) //잘 가져옴
  
  if (!req.session) {
    res.status(401).send("세션이 유효하지 않습니다.")
  }

  res.json(rooms);
  console.log("방 목록 요청에 따른 제공");
});

export default getRoomListRouter;
