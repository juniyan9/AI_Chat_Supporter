import express from 'express';

const router = express.Router();

import bodyParser from "body-parser";
// app.use(bodyParser.json()); 
let app = express();

// 전체 방 배열
let rooms = [];

//방 추가
app.post('/add-room', (req, res) => {
    const { roomName, maxCount, password, isPrivate } = req.body;
    console.log(req.body);

    // 새로운 방 만들기
    const newRoomId = rooms.length + 1;
    const room = {
        id: newRoomId,
        name: roomName,
        count: 1,
        maxCount,
        //방 만든 사람이 설정할 수 있게
        password,
        isPrivate
    };

    rooms.push(room);
    console.log(rooms)

    // 방 성공적으로 등록됨을 전송.
    res.send("방_성공적으로_저장됨");
});

// 방 목록 반환 함수
export function getRooms() {
    return rooms;
}

//방 삭제 함수
export function deleteRoom(roomId) {
    rooms = rooms.filter(room => room.id !== roomId);   //ㅅ
    return rooms;
}


//방 정보 수정


export default router;