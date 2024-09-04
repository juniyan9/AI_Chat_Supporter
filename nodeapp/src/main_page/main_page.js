import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();
let app = express();
const userRegisterRouter = express.Router();

export const sessionObj = {
  secret: process.env.SECRET_KEY, // 세션을 암호화하는 데 사용되는 비밀 키
  store: new session.MemoryStore({ checkPeriod: 3600000 }), //정상 작동.
  resave: false, // 매번 세션 강제 저장
  saveUninitialized: false, // 빈 값도 저장 - empty session obj 쌓이는 거 방지
  cookie: {
    secure: false, // 개발 환경에서는 false, 프로덕션에서는 true로 설정 (HTTPS 필요)
    httpOnly: true, // 클라이언트 측 JavaScript에서 쿠키를 읽을 수 없게 설정
    maxAge: 3600000, //세션 만료됐을 때 세션 정보에서는 삭제되는데 userInfo에서는 삭제 안됨. 
  },
};

//세션 미들웨어가 express의 다른 미들웨어보다 먼저 설정돼야함 (다른 app.use 들보다)
//세션 생성해주는 미들웨어  --> 그래서 app.js로 옮김
// app.use(session(sessionObj));

app.use(cookieParser());
app.use(express.json()); //json 파일 처리
// app.use(cookieParser());

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
  let newUser = {
    id: nextUserId,
    nickName: nickName,
  };

  // userInfo 배열에 새로운 사용자 추가
  userInfo.push({ user: newUser });
  console.log("지금 userInfo에 담긴 정보:");
  console.log(userInfo);

  // 다음 사용자 ID 증가
  nextUserId++;
}

// 닉네임 등록 받아주기 및 응답 전송
// 쿠키 보내줘야 세션 ID로 관리 가능
userRegisterRouter.post("/", (req, res) => {
  // /register로 해버리면 프론트에서 /register/register로 요청한 게 됨.
  // console.log("inside userRegisterRouter")
  const { nickName } = req.body;
  // console.log(req.body);
  // console.log(nickName);

  if (isNickNameExist(nickName)) {
    res.send("exist"); // 닉네임이 중복됨, 위 isNickNameExist 함수 호출해서 true일 경우 이렇게 프론트에 보내는 거
    console.log("사용자가 중복된 닉네임 입력");
  } else {
    addUser(nickName); // 사용자 추가
    req.session.user = {
      id: nextUserId - 1,
      nickName: nickName,
    };

    // res.cookie("id", nextUserId - 1, { maxAge: 120000, httpOnly: true });
    // res.cookie("nickName", nickName, { maxAge: 120000, httpOnly: true });
    res.cookie("id", nextUserId - 1)
    res.cookie("nickName", nickName)

    //쿠키 읽기
    console.log("쿠키 읽기:", req.cookies)

    console.log("세션 정보:", req.session.user);
    res.send("non-existent"); // 사용자 추가 완료
  }
});

export function removeUser(nickName) {
  userInfo = userInfo.filter((user) => user.user.nickName != nickName);
}

export default userRegisterRouter;
