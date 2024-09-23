import { userInfo } from "./main_page.js";
import { sessionObj } from "../app.js";

export function setUserSession(req, userId, nickName) {
  req.session.user = {
    id: userId,
    nickName: nickName,
  };
}

export function getUserSession(req) {
  return req.session.user || null;
}

export function removeUser(user) {
  const index = userInfo.findIndex((userCheck) => userCheck.user.socketId === user.socketId);
  if (index !== -1) {
    userInfo.splice(index, 1);
    console.log(`removeUser 함수:${user.nickName} 정보를 userInfo에서 잘 지웠습니다.`)
    console.log(`유저: ${user.nickName} 정보 삭제 후 userInfo:`, userInfo)
  }
}


// userInfo에서 만료시간 설정
export function extendSession(user) {
  // 새로운 만료 시간을 설정
  const newExpiresAt = new Date(new Date().getTime() + 15 * 60000); // 15분 연장

  // 유저의 세션 정보를 업데이트
  user.sessionExpiresAt = newExpiresAt;

  // 필요시 추가적인 처리(예: 데이터베이스 업데이트)도 할 수 있음
  console.log(`유저: ${user.nickName}의 새로운 세션 만료 시간:`, newExpiresAt);
}