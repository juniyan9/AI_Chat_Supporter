import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { logger } from "../app.js";
dotenv.config();
let app = express();
const userRegisterRouter = express.Router();

app.use(cookieParser);
app.use(express.json()); //json 파일 처리

/*main page*/
/* 유저 등록 */

//닉네임 중복 방지

export let userInfo = [];
let nextUserId = 1; //user ID 초기화

// 닉네임 중복 확인 함수
function isNickNameExist(nickName) {
  for (let i = 0; i < userInfo.length; i++) {
    if (userInfo[i].user.nickName === nickName) {
      return true; // 중복된 닉네임이 존재합니다.
    }
  }
  return false; // 중복된 닉네임이 존재하지 않습니다.
}

// 사용자 추가 함수
function addUser(nickName) {
  let newUser = {id: nextUserId, nickName: nickName,};

  // userInfo 배열에 새로운 사용자 추가
  userInfo.push({ user: newUser });

  // 다음 사용자 ID 증가
  nextUserId++;
}

// 닉네임 등록 받아주기 및 응답 전송
// 쿠키 보내줘야 세션 ID로 관리 가능
userRegisterRouter.post("/", (req, res) => {
  // /register로 해버리면 프론트에서 /register/register로 요청한 게 됨.
  // logger.info("inside userRegisterRouter")
  const { nickName } = req.body;

  if (isNickNameExist(nickName)) {
    res.send("exist"); // 닉네임이 중복됨, 위 isNickNameExist 함수 호출해서 true일 경우 이렇게 프론트에 보내는 거
    logger.info("사용자가 중복된 닉네임 입력");
  } else {
    addUser(nickName); // 사용자 추가

    // res.cookie("key", "value"); //conncect.sid 생성용
    res.cookie("key", "value", { httpOnly: true, secure: false }); // 쿠키 설정


    const SID = req.sessionID;
    // const connectSid = req.cookies['connect.sid']; 
    // logger.info(`req.sessionID from userRegisterRouter: ${SID}`,'main_page.js');
    // logger.info("userRegisterRouter, connectSid:", connectSid);

    // 세션 만료 시간 출력
    const sessionExpiresAt = new Date(req.session.cookie.expires);  //date 객체로 관리
    const sessionMaxAge = req.session.cookie.maxAge; // 설정된 maxAge 확인
    // logger.info(`세션 만료 시간 from userRegisterRouter: ${sessionExpiresAt}`,'main_page.js');

    // logger.info(`세션 유효 시간 from userRegisterRouter: ${sessionMaxAge}`,'main_page.js');


    req.session.user = {id: nextUserId - 1, nickName: nickName, reqSessionID: SID, sessionExpiresAt: sessionExpiresAt,};

    // logger.info(`세션 정보 from userRegisterRouter: ${JSON.stringify(req.session.user)}`,'main_page.js');


    const userIndex = userInfo.findIndex(user => user.user.id === nextUserId - 1);
    if (userIndex !== -1) {
      userInfo[userIndex].user.reqSessionID = SID;
      userInfo[userIndex].user.sessionExpiresAt = sessionExpiresAt;
      // userInfo[userIndex].user.connectSid = connectSid;
    }
    logger.info(`userInfo from userRegisterRouter: ${JSON.stringify(userInfo)}`,'main_page.js');
    
    res.send("non-existent"); // 사용자 추가 완료
  }
});

export default userRegisterRouter;
