/* NodeJS declaration */
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import customLogger from "./class/customLogger.js";
import { deleteRoom, getRooms } from './roomControl.js'; 
import userObj from "./class/user.js";
import roomObj from "./class/room.js";
import path from "path";
import cors from "cors";
import * as url from "url";

let app = express();

const logger = new customLogger();

/* WebSocket declaration */
import { createServer } from "http";
import { Server } from "socket.io";
// import user from "./class/user.js";

const httpServer = createServer();
const io = new Server(httpServer, { cors: "*" });

/* NodeJS implementation */

// Set filePath
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

/* middleware */
//app.use('요청 경로', express.static('실제 경로'));

app.use("/", express.static(path.join(__dirname, "reactapp/build")));
// app.use('/', express.static(__dirname));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ cors: "*" }));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.readFile("index.html");
});

/* 유저 등록 */

// //닉네임 중복 방지

let userInfo = [];
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
    socketId: null,
    roomName: null,
  };

  // userInfo 배열에 새로운 사용자 추가
  userInfo.push({ user: newUser });
  console.log("지금 userInfo에 담긴 정보:");
  console.log(userInfo);

  // 다음 사용자 ID 증가
  nextUserId++;

  // userInfo 배열을 이루는 요소의 타입 확인
  // userInfo.forEach((item, index) => {
  //   console.log(`id: ${index + 1}:`);
  //   console.log("Type of item:", typeof item); // 전체 요소 출력
  //   console.log("---");
  // });
}

// 닉네임 등록 받아주기 및 응답 전송
// 쿠키 보내줄지 결정
app.post("/register", (req, res) => {
  const { nickName } = req.body;
  console.log(req.body)
  console.log(nickName)

  if (isNickNameExist(nickName)) {
    res.send("exist"); // 닉네임이 중복됨, 위 isNickNameExist 함수 호출해서 true일 경우 이렇게 프론트에 보내는 거
    console.log("사용자가 중복된 닉네임 입력");
  } else {
    addUser(nickName); // 사용자 추가
    res.send("non-existent"); // 사용자 추가 완료
  }
});


/*로비*/
let rooms = [];

/*방 만들기 및 설정 저장*/
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

/*방 목록 갱신 */
app.get('/rooms', (req, res) => {
  res.json(rooms);
});

/*
방 입장
*/ 

let room = [
  {
    id: 0,
    name: "room1",
    count: 1,
    maxCount: 10,
    password: "1111",
  },
  {
    id: 1,
    name: "room2",
    count: 3,
    maxCount: 7,
    password: "2222",
  },
];

app.get("/chatList", (req, res) => {
  res.send(room);
});

/* WebSocket implementation */

const WS_port = 5050;
httpServer.listen(WS_port, () => {
  console.log("WebSocket listening at port %d", WS_port);
});

const PORT = 3000;

let roomUserCounts = {};
// let roomUsers = {};

//events
io.on("connection", (socket) => {
  logger.info("A Client has connected.");

  // 방에 들어갈 때 socketId와 roomName이 userInfo의 user에 업데이트 돼야함.
  socket.on("enter_room", (nickName, roomName) => {
    console.log("소켓 연결");

    let user = null; //아래 if (userCheck) 밖에서도 user에 접근하기 위함.

    // userInfo 배열에서 nickname으로 사용자 객체 찾기
    const userCheck = userInfo.find(
      (check) => check.user.nickName === nickName
    );
    // userCheck는 userInfo.find를 통해 찾은 사용자 객체를 감싼 객체
    // userCheck = { user: { id: 1, nickName: 'Alice', socketId: 'someSocketId', roomName: 'room1' } };

    if (userCheck) {
      user = userCheck.user; //const user가 아니라 그냥 user로 해줘야 여기 if 블록 밖에서도 사용 가능.
      user.socketId = socket.id;
      user.roomName = roomName;
      // const roomName = user.roomName;

      logger.info(`Client (${user.nickName}) called 'enter_room'.`);

      const ipAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
      // const ipAddress = socket.request.headers['x-forwarded-for'] || req.connection.remoteAddress; //이거 안됨


      console.log(`방에 들어온 사용자 정보:`, {
        id: user.id,
        nickName: user.nickName,
        socketId: user.socketId,
        roomName: user.roomName,
        ipAddress: ipAddress
      });

      logger.info(`${user.nickName} has joined ${user.roomName}`);

      // 방 이름이 없으면 초기화
      if (!roomUserCounts[roomName]) {
        roomUserCounts[roomName] = 0;
      }

      socket.join(user.roomName); //해당 소켓을 특정 방에 추가

      roomUserCounts[roomName] += 1;

      console.log(
        `${roomName}에 있는 사람 수: ${roomUserCounts[roomName] || 0} 명`
      );
    } else {
      console.error("사용자를 찾을 수 없습니다.");
    }

    //웰컴 메시지
    if (user) {
      //userCheck의 user
      socket.emit("reply", `${nickName}님이 입장하셨습니다. 반갑습니다.`); // 나도 웰컴 메시지 확인할 수 있게 수정.

      //broadcast: 현재 소켓(클라이언트)을 제외한 다른 소켓들에게만 메시지 보냄.
      socket.broadcast
        .in(roomName)
        .emit("reply", `${nickName}님이 입장하셨습니다. 반갑습니다.`);
    } //위에서는 if(user)로 user를 걸어줘서 user.nickName / user.roomName 이런 식으로 안 해줘도 됨.
  });

  //유저 메시지 접수 및 소켓들에 보내주기
  socket.on("message", (message, roomName) => {
    logger.info("Received message from client: " + message);
    logger.info("Received message from client room: " + roomName);

    // userInfo 배열에서 socket.id에 해당하는 사용자 객체 찾기
    const userCheck = userInfo.find(
      (check) => check.user.socketId === socket.id
    );

    if (userCheck) {
      const user = userCheck.user;
      socket.to(roomName).emit("reply", message, user.nickName);
    } else {
      console.error("사용자를 찾을 수 없습니다.");
    }
  });

  // 방 삭제 요청
  socket.on('delete_room', (roomId) => {
    rooms = rooms.filter(room => room.id !== roomId);
    console.log(rooms);

    // 방 삭제 후 모든 클라이언트에게 채팅방 목록 업데이트를 알립니다.
    io.emit('updated_rooms', rooms);
  });

  //소켓 연결 해제 처리
  // socket.on("disconnect", (roomName) => {  //소켓 끊어질 때 자동으로 발생하는 이벤트이므로 클라에서 관련 코드를 굳이 수동으로 호출할 필요 없고, 따라서 여기서도 roomName 넣어줄 필요가 없게 됨.
  socket.on("disconnect", () => {
    const userCheck = userInfo.find(
      (check) => check.user.socketId === socket.id
    );

    if (userCheck) {
      const user = userCheck.user;
      logger.info("A client has disconnected");
      const roomName = user.roomName; // 사용자 객체에서 방 이름 찾기

      if (roomName && roomUserCounts[roomName]) {
        roomUserCounts[roomName] -= 1;
        // roomName이 존재하고, roomUserCounts 객체에 roomName 속성이 존재할 경우에만 위 코드 실행됨.
      }

      socket.emit("reply", `${user.nickName}님이 방을 나갔습니다.`);
      socket.broadcast
        .to(roomName)
        .emit("reply", `${user.nickName}님이 방을 나갔습니다.`);

      // delete users[socket.id];
      user.socketId = null;
      user.roomName = null;
      // console.log(userInfo);
      console.log(`방을 나간 사용자 정보:`, {
        id: user.id,
        nickName: user.nickName,
        socketId: user.socketId,
        roomName: user.roomName,
      });
      console.log(
        `${roomName}에 남아있는 사람 수: ${roomUserCounts[roomName] || 0} 명`
      );
    }
  });
});

export { app, io };
