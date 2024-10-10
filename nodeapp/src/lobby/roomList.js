import express from "express";
import cookieParser from "cookie-parser";
import { logger } from "../app.js";
let app = express();
const getRoomListRouter = express.Router();

app.use(express.json()); //json 파일 처리

import { rooms } from "./addRoom.js";
import { userInfo } from "../main_page/main_page.js";

app.use(cookieParser());

const timeoutmin = 15 * 1000

// 방 목록 갱신
getRoomListRouter.get("/", (req, res) => {

  //  logger.info(`getRoomListRouter, session check: ${JSON.stringify(req.session.user)}`, 'roomList.js')
  
  if (!req.session || !req.session.user) {
    return res.status(401).send("세션이 유효하지 않습니다.")
  }

  // 사용자 정보 업데이트
  const userIndex = userInfo.findIndex(user => user.user.id === req.session.user.id);
  
  if (userIndex === -1) {
    return res.status(404).send("사용자를 찾을 수 없습니다.");
  }

  const user = userInfo[userIndex].user;
  // console.log("roomlist, if문 위에서:", user.timeoutId)
  if (!user.timeoutId) {
    // 새로운 타임아웃 설정 
    logger.info(`User ${user.nickName}의 timeout이 생성되었습니다.`,'roomList.js');
    const timeoutId = setTimeout(() => {
    logger.info(`User ${user.nickName}이 timeout 되었습니다.${user.timeoutId}`,'roomList.js');
    //실제로 timeout돼서 퇴출될 때 위 로그가 찍힘 (타이머에 할당된 시간 끝나고 콜백 실행)
    user.timeoutId = null;
    }, timeoutmin);
    // 사용자 정보 업데이트
    user.timeoutId = timeoutId;
  } else {
    // logger.info(`User ${user.nickName}의 timeout 생성 안 되었습니다.`,'roomList.js');
  }
  const roomsAndTimeout = {rooms: rooms, timeoutmin: timeoutmin}
  res.json(roomsAndTimeout)
});

export default getRoomListRouter;
