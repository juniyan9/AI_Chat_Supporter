import express from "express";
let app = express();
const getRoomListRouter = express.Router();

app.use(express.json()); //json 파일 처리

import { rooms } from "./addRoom.js";
import { userInfo } from "../main_page/main_page.js";

// 방 목록 갱신
// export function getRoomList(app) {
getRoomListRouter.get("/", (req, res) => {
  // if (!req.session.nickName || !req.session.userId) {
  //   userInfo = userInfo.filter(
  //     (user) => user.user.nickName != req.session.nickName
  //   );
  //   console.log("세션 없음. userInfo에서 유저 객체 삭제 완료.");
  //   res.status(401).send("세션이 유효하지 않습니다.");
  // } else {
    res.json(rooms);
    console.log("방 목록 요청에 따른 제공");
  // }
});
// }

export default getRoomListRouter;
