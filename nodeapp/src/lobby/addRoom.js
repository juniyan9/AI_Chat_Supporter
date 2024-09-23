import express from "express";
import cookieParser from "cookie-parser";
import userRegisterRouter from "../main_page/main_page.js";
// import session from "express-session";
// import { sessionObj } from "../main_page/main_page.js";

let app = express();
const addRoomRouter = express.Router();

// addRoomRouter.use(session(sessionObj));

app.use(express.json()); //json 파일 처리
app.use(cookieParser());

import { removeUser, userInfo } from "../main_page/main_page.js"; //let userInfo = [];

export let rooms = [];
let nextRoomId = 1;

/*방 만들기 및 설정 저장*/
addRoomRouter.post("/", (req, res) => {
  const { name, count, maxCount, password, isPrivate, nickName } = req.body;

  const cookies = req.cookies;
  console.log("쿠키 정보:", cookies)

  // console.log(req.session.user.nickName)

  // const cookie_id = req.cookies.id;
  // const cookie_nickName = req.cookies.nickName;

  // if (cookie_id && cookie_nickName) {
  //   const userInfoArray = userInfo.find(
  //     (user) =>
  //       user.user.id !== cookie_id && user.user.nickName == cookie_nickName
  //   );

  //   if (userInfoArray) {
  //     removeUser(cookie_nickName);
  //     res
  //       .status(401)
  //       .send("세션 정보가 유효하지 않음. userInfo에서 해당 닉네임 객체 삭제.");
  //   }
  // } else {  //cookie_id와 닉네임이 없는 경우
  //   console.log("쿠키 ID:", cookie_id, "쿠키 닉네임:", cookie_nickName);
  // }

  // console.log("userInfo:", userInfo);
  // if (!req.session.user) {
  //   return res.status(401).send("세션이 존재하지 않습니다."); // 401(Unauthorized)는 클라이언트가 인증되지 않았거나, 유효한 인증 정보가 부족하여 요청이 거부되었음을 의미하는 상태값
  // }
  //세션이 존재하는데 왜 얘가 자꾸 출력이 되는가
  //얘를 주석처리하면 방은 만들어짐
  //아니 세션이 있는데 왜 자꾸 이 코드가 실행되는 것인가

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

export default addRoomRouter;
