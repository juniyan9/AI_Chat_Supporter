/* NodeJS declaration */
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import customLogger from "./class/customLogger.js";
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
let roomUsers = {}; //방에 참여하는 유저만 관리
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
  console.log(req.body);
  console.log(nickName);

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
let nextRoomId = 1;

/*방 만들기 및 설정 저장*/
app.post("/add-room", (req, res) => {
  const { name, count, maxCount, password, isPrivate, nickName } = req.body;

  if (!nickName) {
    return res.status(400).send("방 설정에 nickName이 안 왔습니다.");
  }

  //받은 닉네임을 userInfo의 닉네임과 비교해서 유저를 찾음(유저 id를 ownerId로 매치해주기 위함)
  const userCheck = userInfo.find((user) => user.user.nickName === nickName);

  if (!userCheck) {
    return res
      .status(404)
      .send("해당 nickName을 가진 사용자를 찾을 수 없습니다.");
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
  };

  console.log("받은 room 설정 정보:", room);

  //rooms 배열에 푸시
  rooms.push(room);

  console.log("업데이트된 방 배열:", rooms);

  // 방 성공적으로 등록됨을 전송.
  res.send("방_성공적으로_저장됨");
});

/*방 목록 갱신 */
app.get("/rooms", (req, res) => {
  res.json(rooms);
});

/*방 입장*/

/*로그아웃-유저 삭제*/
app.post("/logout", (req, res) => {
  const { userId } = req.body;
  console.log(req.body);

  // userId에 해당하는 사용자 객체 삭제
  userInfo = userInfo.filter((user) => user.user.id !== userId); //들어온 userId와 user객체의 id가 같지 않은 경우로만 새 배열 만들어서 userInfo에 저장. 즉, 지우고 싶은 id는 이미 제외시키고 새 배열 만듦.
  console.log(userInfo);

  // 성공 응답 전송
  res.send("로그아웃_완료");
});

/*dummy 방 데이터*/
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

// let roomUserCounts = {};
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

      const ipAddress =
        socket.request.headers["x-forwarded-for"] ||
        socket.request.connection.remoteAddress;
      // const ipAddress = socket.request.headers['x-forwarded-for'] || req.connection.remoteAddress; //이거 안됨

      console.log(`방에 들어온 사용자 정보:`, {
        id: user.id,
        nickName: user.nickName,
        socketId: user.socketId,
        roomName: user.roomName,
        ipAddress: ipAddress,
      });

      logger.info(`${user.nickName} has joined ${user.roomName}`);

      //방이 없을 경우 방을 새로 만들어서 rooms 배열에 업데이트
      let room = rooms.find((room) => room.name === roomName);
      if (!room) {
        room = { name: roomName, count: 0 };
        rooms.push(room);
        console.log(`${roomName} 방이 생성되었고, rooms 배열에 입력 완료.`);
      }

      if (!Array.isArray(roomUsers[roomName])) {
        roomUsers[roomName] = []; // 배열로 만들어주고, 빈 배열로 초기화
      }

      // 사용자 ID를 배열에 추가
      roomUsers[roomName].push(user.id);

      socket.join(user.roomName); //해당 소켓을 특정 방에 추가

      //roomUsers 기준으로 방 count 업데이트
      // const room = rooms.find((room) => room.name === roomName);
      // if (room) {
      // room.count += 1;
      room.count = roomUsers[roomName].length;
      // }
      console.log(
        `${roomName}에 있는 사람 수: ${roomUsers[roomName].length} 명`
      );

      console.log("roomUsers 객체 정보(방에 있는 사용자 ID):", roomUsers);

      const userIds = roomUsers[roomName].join(",");
      console.log(`${roomName} 방의 유저 ID 목록: 유저 ID: ${userIds}`);
    } else {
      console.error("사용자를 찾을 수 없습니다.");
    }

    //웰컴 메시지
    if (user) {
      //userCheck의 user
      socket.emit("reply", `${nickName}님이 입장하셨습니다. 반갑습니다.`); // 나도 웰컴 메시지 확인할 수 있게 수정.
      // res.send("웰컴메시지 보냄.")

      //broadcast: 현재 소켓(클라이언트)을 제외한 다른 소켓들에게만 메시지 보냄.
      socket.broadcast
        .in(roomName)
        .emit("reply", `${nickName}님이 입장하셨습니다. 반갑습니다.`);
    } //위에서는 if(user)로 user를 걸어줘서 user.nickName / user.roomName 이런 식으로 안 해줘도 됨.
  });

  // //유저 메시지 접수 및 소켓들에 보내주기
  socket.on("message", (message, roomName) => {
  // // socket.on('message', (messageData) => {
  //   // const { socketId, messageId, message, roomName, date } = messageData;
    logger.info("Received message from client: " + message);
    logger.info("Received message from client room: " + roomName);

  // //   const message = {
  // //     socketId,
  // //     messageId,
  // //     message,
  // //     roomName,
  // //     date
  // // };

  //   // messages.push(message);
  //   // console.log('Updated messages array:', messages);

  //   // socket.to(roomName).emit('reply', message);

  //   // userInfo 배열에서 socket.id에 해당하는 사용자 객체 찾기
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

  socket.on("update_messages", (updatedMessages) => {

    console.log("클라이언트에서 받은 updated messages:", updatedMessages);
    // console.log('소켓이 서버에 연결되었습니다. 소켓 ID:', socket.current.id);

    let count1 = 0;
    updatedMessages.forEach((message) => {
      const { ROOMNAME, MESSAGE, NickName, MESSAGE_ID, DATE } = message;
      // const ROOMNAME = updatedMessages[0].ROOMNAME
      let count2 = 0;
      count1 += 1
      count2 += 1

      if (ROOMNAME) {
        socket.to(ROOMNAME).emit('update_messages_reply', MESSAGE, NickName);   //reply
        //통으로 전달할려면 updatedMessages를 넣어야 하나
        //전달받는 데이터가 저렇게 다섯 가지 있어서 통으로 전달 안 한건데
        // ui 에 선택적으로 message, nickname만 뿌리면 되나..?
        
        // console.log("emit 코드 읽음");
        console.log(`count2: ${count2}, ${count1}클라한테 메시지, 닉네임 전달.`, ROOMNAME, 'with message:', MESSAGE, 'and nickname:', NickName);

        // socket.broadcast.to(ROOMNAME).emit('update_messages_reply', MESSAGE, NickName);
      }
    });
    socket.emit("message_status", "메시지가 성공적으로 전송되었습니다.");
  });

  // 방 삭제 요청
  socket.on("delete_room", (roomId) => {
    rooms = rooms.filter((room) => room.id !== roomId);
    console.log(rooms);

    // 방 삭제 후 모든 클라이언트에게 채팅방 목록 업데이트를 알립니다.
    io.emit("updated_rooms", rooms);
  });

  // 로그아웃 요청 -- 이거 해야 하나?
  socket.on("logout", (userId) => {
    // 사용자 객체 삭제
    userInfo = userInfo.filter((user) => user.user.id !== userId);
    console.log(`사용자 ID: ${userId} 로그아웃됨`);

    const userCheck = userInfo.find(
      (check) => check.user.socketId === socket.id
    );

    // socket.disconnect();
    if (userCheck) {
      const user = userCheck.user;
      const roomName = user.roomName;

      if (roomName) {
        // 방의 유저 리스트에서 해당 유저를 제거
        if (roomUsers[roomName]) {
          roomUsers[roomName] = roomUsers[roomName].filter(
            (id) => id !== userId
          );
          console.log("roomUsers:", roomUsers);

          // 방의 유저 수 갱신
          const roomObj = rooms.find((room) => room.name === roomName);
          if (roomObj) {
            roomObj.count = roomUsers[roomName].length;
          }
        }

        // 방에 있는 다른 클라이언트에게 퇴장 메시지 전송
        socket.broadcast
          .to(roomName)
          .emit("reply", `${user.nickName}님이 방을 나갔습니다.`);
        console.log("유저 로그아웃에 따른 퇴장 메시지 전송 완료");
      }

      // 소켓 연결 해제
      socket.disconnect();
    }
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

      console.log("Room Name:", roomName);

      if (roomName) {
        const room = rooms.find((room) => room.name === roomName);
        if (room) {
          if (!Array.isArray(roomUsers[roomName])) {
            // roomUsers[roomName]이 배열이 아닐 경우, 빈 배열로 초기화
            roomUsers[roomName] = [];
            console.log("roomUsers[roomName] 배열 만들기 완료");
            console.warn(
              `${roomName} 방의 사용자 목록이 배열이 아니어서 빈 배열로 초기화`
            );
          }

          roomUsers[roomName] = roomUsers[roomName].filter(
            (id) => id !== user.id
          );
          room.count = roomUsers[roomName].length;

          console.log("Rooms Array:", rooms);
          console.log("roomUsers 업데이트 완료", roomUsers);

          const userIds = roomUsers[roomName].join(",");
          console.log(`${roomName} 방의 사용자 목록: 유저 ID: ${userIds}`);
          console.log(`${roomName}에 남아있는 사람 수: ${room.count || 0} 명`);
        }

        socket.emit("reply", `${user.nickName}님이 방을 나갔습니다.`);
        socket.broadcast
          .to(roomName)
          .emit("reply", `${user.nickName}님이 방을 나갔습니다.`);

        user.nickName = null;
        user.socketId = null;
        user.roomName = null;

        console.log(`방을 나간 사용자 정보:`, {
          id: user.id,
          nickName: user.nickName,
          socketId: user.socketId,
          roomName: user.roomName,
        });
      } else {
        console.error("사용자의 방 정보가 없습니다.");
      }
    } else {
      console.error("socket.id가 없어 사용자를 찾을 수 없습니다.");
    }
  });
});

export { app, io };
