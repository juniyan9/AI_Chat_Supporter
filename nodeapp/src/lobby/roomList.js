import express from "express";
let app = express();
const getRoomListRouter = express.Router();

app.use(express.json()); //json 파일 처리

import { rooms } from "./addRoom.js";

// 방 목록 갱신
// export function getRoomList(app) {
getRoomListRouter.get("/", (req, res) => {
  res.json(rooms);
  console.log("방 목록 요청에 따른 제공");
});
// }

export default getRoomListRouter;
