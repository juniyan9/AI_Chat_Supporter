import express from "express";
let app = express();
const addRoomRouter = express.Router();

app.use(express.json()); //json 파일 처리

import { userInfo } from "../main_page/main_page.js"; //let userInfo = [];
export let rooms = [];
let nextRoomId = 1;

/*방 만들기 및 설정 저장*/
// export function addRoom(app) {
addRoomRouter.post("/", (req, res) => {
  const { name, count, maxCount, password, isPrivate, nickName } = req.body;

  if (!nickName) {
    return res.status(400).send("방 설정에 닉네임이 필요합니다.");
  }

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

  // console.log("현재 방 배열:", rooms);

  // 방 성공적으로 등록됨을 전송.
  res.send("방_성공적으로_저장됨");
});
// }

export default addRoomRouter;
