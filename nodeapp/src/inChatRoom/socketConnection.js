import { createServer } from "http";
const httpServer = createServer();
import { Server } from "socket.io";
const io = new Server(httpServer, { cors: "*" });
import cors from "cors";

import { logger } from "../app.js";
import { userInfo } from "../main_page/main_page.js";
import { rooms } from "../lobby/addRoom.js";

export function socketConnection() {
  let roomUsers = {};

  const WS_port = 5050;
  httpServer.listen(WS_port, () => {
    console.log("WebSocket listening at port %d", WS_port);
  });

  //events
  io.on("connection", (socket) => {
    logger.info("A Client has connected.");

    // 방에 들어갈 때 socketId와 roomName이 userInfo의 user에 업데이트 돼야함.
    socket.on("enter_room", (nickName, roomName) => {
      console.log("소켓 연결");

      let user = null; //아래 if (userCheck) 밖에서도 user에 접근하기 위함.

      // userInfo 배열에서 nickname으로 사용자 객체 찾기
      let userCheck = userInfo.find(
        (check) => check.user.nickName === nickName
      );

      if (userCheck) {
        user = userCheck.user; //const user가 아니라 그냥 user로 해줘야 여기 if 블록 밖에서도 사용 가능.

        //세션이 있어야 소켓 입장할 수 있도록 세션 체크
        //세션 체크
        if (new Date() > new Date(user.sessionExpiresAt)) {
          console.log("세션 만료됨:", user.sessionExpiresAt);
          socket.emit("error", {
            code: "SESSION_EXPIRED",
            message: "세션이 만료되었습니다. 방에 입장할 수 없습니다.",
          });
          return; // 세션이 만료되었으므로 추가 작업을 수행하지 않음
        }

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

        room.count = roomUsers[roomName].length;
        // }
        console.log(
          `${roomName}에 있는 사람 수: ${roomUsers[roomName].length} 명`
        );

        // socket.emit("roomCountUpdate", room.count);
        io.to(roomName).emit("roomCountUpdate", room.count);

        console.log(
          "현재 방 사용자 정보(roomUsers) [방에 있는 사용자 ID]:",
          roomUsers
        );

        // console.log("방 정보:", room );
        socket.emit("room_details", room);
        io.to(roomName).emit("room_details", room);

        // console.log("업데이트된 방 정보 전달:", room)
        // socket.emit('update_room', room)
        io.to(roomName).emit("update_room", room);

        const userIds = roomUsers[roomName].join(",");
        // console.log(`${roomName} 방의 유저 ID 목록: 유저 ID: ${userIds}`);
      } else {
        console.error("사용자를 찾을 수 없습니다.");
      }

      //웰컴 메시지
      if (user) {
        //userCheck의 user
        socket.emit(
          "reply",
          `${nickName}님이 입장하셨습니다. 반갑습니다.`,
          "알리미"
        ); // 나도 웰컴 메시지 확인할 수 있게 수정.
        // res.send("웰컴메시지 보냄.")

        //broadcast: 현재 소켓(클라이언트)을 제외한 다른 소켓들에게만 메시지 보냄.
        socket.broadcast
          .in(roomName)
          .emit(
            "reply",
            `${nickName}님이 입장하셨습니다. 반갑습니다.`,
            "알리미"
          );
      } //위에서는 if(user)로 user를 걸어줘서 user.nickName / user.roomName 이런 식으로 안 해줘도 됨.
    });

    // //유저 메시지 접수 및 소켓들에 보내주기
    //socket id, message id, roomName, message, date 받아오기
    socket.on("message", (message, roomName) => {

      const userCheck = userInfo.find(
        (check) => check.user.socketId === socket.id
      );

      // socket.to(roomName).emit('reply', message, userCheck.user.nickName);
      // if (userCheck) {
      // io.to(roomName).emit('reply', message, userCheck.user.nickName);
      // logger.info("Received message from client: " + message);
      // logger.info("Received message from client room: " + roomName);
      // }

      // messages.push(message);
      //   // console.log('Updated messages array:', messages);

      socket.to(roomName).emit('reply', message);
    });

    // socket.on("update_messages", (updatedMessages) => {
    //   console.log("클라이언트에서 받은 updated messages:", updatedMessages);
    //   // console.log('소켓이 서버에 연결되었습니다. 소켓 ID:', socket.current.id);

    //   let count1 = 0;
    //   updatedMessages.forEach((message) => {
    //     const { ROOMNAME, MESSAGE, NickName, MESSAGE_ID, DATE } = message;
    //     // const ROOMNAME = updatedMessages[0].ROOMNAME
    //     let count2 = 0;
    //     count1 += 1;
    //     count2 += 1;

    //     if (ROOMNAME) {
    //       socket.to(ROOMNAME).emit("update_messages_reply", MESSAGE, NickName); //reply
    //       //통으로 전달할려면 updatedMessages를 넣어야 하나
    //       //전달받는 데이터가 저렇게 다섯 가지 있어서 통으로 전달 안 한건데
    //       // ui 에 선택적으로 message, nickname만 뿌리면 되나..?

    //       // console.log("emit 코드 읽음");
    //       console.log(
    //         `count2: ${count2}, ${count1}클라한테 메시지, 닉네임 전달.`,
    //         ROOMNAME,
    //         "with message:",
    //         MESSAGE,
    //         "and nickname:",
    //         NickName
    //       );

    //       // socket.broadcast.to(ROOMNAME).emit('update_messages_reply', MESSAGE, NickName);
    //     }
    //   });
    //   socket.emit("message_status", "메시지가 성공적으로 전송되었습니다.");
    // });

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
              console.warn(`${roomName} 방의 사용자 목록이 배열이 아니어서 빈 배열로 초기화`);
            }

            // 방장인지 확인
            if (user.nickName == room.ownerNickname) {
              io.to(roomName).emit("roomDeleted", "방장이 방을 삭제했습니다.");
              
          
              // 받은 roomName으로 rooms 배열에서 해당 방을 찾음
              const roomIndex = rooms.findIndex((room) => room.name === roomName);


              // 방이 존재하는 경우, rooms 배열에서 삭제함
              if (roomIndex !== -1) {
                  rooms.splice(roomIndex, 1); // 배열에서 해당 인덱스의 방을 삭제
                  console.log("방 삭제 후 rooms 배열:", rooms);
              }

              console.log('hycoih::::', roomUsers);
              roomUsers = rooms.filter((room) => room.name !== roomName);
              console.log('hycoih::::', roomUsers);

            } else {
              //채팅방 실 사용자 관리 배열 업데이트
              roomUsers[roomName] = roomUsers[roomName].filter((id) => id !== user.id);
              room.count = roomUsers[roomName].length;
              console.log("Rooms Array:", rooms);
              console.log("방 나감 확인 - roomUsers", roomUsers);
              const userIds = roomUsers[roomName].join(",");
              console.log(`${roomName} 방의 사용자 목록: 유저 ID: ${userIds}`);
              console.log(`${roomName}에 남아있는 사람 수: ${room.count || 0} 명`);

              io.to(roomName).emit("roomCountUpdate", room.count);
             
            //  socket.emit("reply", `${user.nickName}님이 방을 나갔습니다.`, "알리미");
              socket.broadcast.to(roomName).emit("reply", `${user.nickName}님이 방을 나갔습니다.`, "알리미");

              const min = 15
              user.sessionExpiresAt = new Date(Date.now() + min * 60000);
            }
          }
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

    socket.on("delete_room", (roomName) => {

      const room = rooms.find((room) => room.name === roomName);

      let userCheck = userInfo.find(
        (check) => check.user.roomName === roomName
      );

      let user;

      if (userCheck) {
      user = userCheck.user; 
      }
    
        // 받은 roomName으로 rooms 배열에서 해당 방을 찾습니다.
      const roomIndex = rooms.findIndex((room) => room.name === roomName);


        // 방이 존재하는 경우, rooms 배열에서 삭제합니다.
      if (roomIndex !== -1) {
          rooms.splice(roomIndex, 1); // 배열에서 해당 인덱스의 방을 삭제
          console.log("방 삭제 후 rooms 배열:", rooms);
        }

        // roomUsers = rooms.filter((room) => room.name !== roomName);
        delete roomUsers[roomName]

        io.to(roomName).emit("roomDeleted", "방장이 방을 삭제했습니다.");
    });
  });
}
