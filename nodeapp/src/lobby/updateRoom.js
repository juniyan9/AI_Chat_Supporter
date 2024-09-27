import express from "express";
let app = express();
const updateRoomDataRouter = express.Router();

app.use(express.json()); //json 파일 처리

import { rooms } from "./addRoom.js";

// export function updateRoomData(app){
updateRoomDataRouter.post("/", (req, res) => {

  console.log("updateRoomDataRouter, session check:", req.session.user)

  if (!req.session.user) {
    return res.status(401).send("세션이 유효하지 않습니다. 유저 정보가 삭제되었습니다.");
  }

  const {
    originalName,
    updatedName,
    ownerNickname,
    updatedMaxCount,
    updatedPassword,
    updatedIsPrivate,
  } = req.body;
  console.log("update_room 요청 받음:", req.body);

  //ownerNickname 왔는지 안 왔는지 체크
  if (!ownerNickname) {
    return res.status(400).send("업데이트된 방 정보에 nickname이 안 왔습니다.");
  }

  //ownerNickname이랑 originalName으로 기존 방 배열에 해당 닉네임이랑 방 이름으로 만든 방이 있는지 확인
  const roomCheck = rooms.find(
    (room) => room.ownerNickname === ownerNickname && room.name === originalName
  );

  if (!roomCheck) {
    return res.status(404).send("해당 ownerNickname이 만든 방이 없습니다.");
  }
  //ownerNickname과 originalName 기준으로 room 인덱스 찾기
  let roomIndex = rooms.findIndex(
    (room) => room.ownerNickname === ownerNickname && room.name === originalName
  );

  if (roomIndex !== -1) {
    const updatedRoomData = {
      id: rooms[roomIndex].id,
      name: updatedName,
      count: rooms[roomIndex].count,
      maxCount: updatedMaxCount,
      password: updatedPassword,
      isPrivate: updatedIsPrivate,
      ownerID: rooms[roomIndex].ownerID,
      ownerNickname: ownerNickname,
    };

    //roomUpdate를 인덱스로 해서 그 위치에 업데이트한 방 정보 덮어씌우기
    rooms[roomIndex] = updatedRoomData;
    // console.log(updatedRoomData)

    console.log("방 정보 업데이트 성공");

    res.send({ status: "방 정보 업데이트 성공", data: updatedRoomData });
  } else {
    console.log("업데이트된 방 정보가 없습니다.");
    res.status(404).send("업데이트된 방 정보가 없습니다.");
  }
});
// };

export default updateRoomDataRouter;
