import express from "express";
import { removeUser } from "../main_page/sessionUtils.js";
import session from "express-session";

let app = express();
app.use(express.json()); // JSON 파서 추가
const addRoomRouter = express.Router();

import { userInfo } from "../main_page/main_page.js"; //let userInfo = [];

export let rooms = [];
let nextRoomId = 1;

/*방 만들기 및 설정 저장*/
addRoomRouter.post("/", (req, res) => {
  const { name, count, maxCount, password, isPrivate, nickName } = req.body;

   // 방 이름 중복 확인
   const existingRoom = rooms.find(room => room.name === name);
   if (existingRoom) {
    console.log("addRoomRouter, 방 이름 중복 에러 메시지 보냄")
     return res.status(400).json({ message: "이미 존재하는 방 이름입니다." });
   }

  console.log("addRoomRouter, 방 만들 때 session.user 정보:", req.session.user); //서버에서 띄우면 o, 타 도메인에서는 x

  if (!req.session.user) {
    return res.status(401).send("세션이 유효하지 않습니다. 유저 정보가 삭제되었습니다.");
  }

  const sessionUser = req.session.user;

  //받은 닉네임을 userInfo의 닉네임과 비교해서 유저를 찾음(유저 id를 ownerId로 매치해주기 위함)
  const userCheck = userInfo.find((user) => user.user.nickName === nickName);

  if (!userCheck) {
    return res
      .status(404)
      .send("해당 닉네임을 가진 사용자를 찾을 수 없습니다.");
  }

  const ownerID = userCheck.user.id;

  const room = {
    id: nextRoomId++, // 자동 증가하는 방 ID
    name,
    count,
    maxCount,
    password,
    isPrivate,
    ownerID,
    ownerNickname: nickName,
  };

  console.log("받은 room 설정 정보:", room);

  //rooms 배열에 푸시
  rooms.push(room);

  // 방 성공적으로 등록됨을 전송.
  res.status(200).json({ message: "방_성공적으로_저장됨" });
  console.log("addRoom 방 저장 정보 잘 보냄")
});

export default addRoomRouter;
