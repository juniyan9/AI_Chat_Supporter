import express from "express";
let app = express();
const userRegisterRouter = express.Router();

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
// 쿠키 보내줄지 결정
// export function userRegister(app) {
userRegisterRouter.post("/", (req, res) => {  // /register로 해버리면 프론트에서 /register/register로 요청한 게 됨.
  console.log("inside userRegisterRouter")
  const { nickName } = req.body;
  // console.log(req.body);
  // console.log(nickName);

  if (isNickNameExist(nickName)) {
    res.send("exist"); // 닉네임이 중복됨, 위 isNickNameExist 함수 호출해서 true일 경우 이렇게 프론트에 보내는 거
    console.log("사용자가 중복된 닉네임 입력");
  } else {
    addUser(nickName); // 사용자 추가
    res.send("non-existent"); // 사용자 추가 완료
  }
});
// }

export default userRegisterRouter;
