import express from "express";

import { rooms } from "../lobby/addRoom.js";

let app = express();
const deleteRoomRouter = express.Router();

deleteRoomRouter.post("/", (req, res) => {
    const { roomName } = req.body;

    if (!roomName) {
        return res.status(400).json({ error: '방 이름이 제공되지 않았습니다.' });
    }

    // 받은 roomName으로 rooms 배열에서 해당 방을 찾습니다.
    const roomIndex = rooms.findIndex((room) => room.name === roomName);

    // 방이 존재하는 경우, rooms 배열에서 삭제합니다.
    if (roomIndex !== -1) {
        rooms.splice(roomIndex, 1); // 배열에서 해당 인덱스의 방을 삭제
        console.log("방 삭제 후 rooms 배열:", rooms);
        return res.json({ message: '방 삭제를 성공했습니다.' });
    } else {
        return res.status(404).json({ error: '방을 찾지 못했습니다.' });
    }
});

export default deleteRoomRouter;