import { createServer } from "http";
const httpServer = createServer();
import { Server } from "socket.io";
const io = new Server(httpServer, { cors: "*" });

import { logger } from "../app.js";
import { userInfo } from "../main_page/main_page.js";
import { rooms } from "../lobby/addRoom.js";

export function socketConnection() {
  let roomUsers = {};

  const WS_port = 5050;
  httpServer.listen(WS_port, () => {
    logger.info("WebSocket listening at port %d", WS_port);
  });

  //events
  io.on("connection", (socket) => {
    logger.info("A Client has connected.");
    // console.log("socket:", socket) //잘 찍음
    // console.log("socket.id:", socket.id) //잘 찍음

    // 방에 들어갈 때 socketId와 roomName이 userInfo의 user에 업데이트 돼야함.
    socket.on("enter_room", (nickName, roomName) => {
      logger.info('소켓연결','socketConnection.js');

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
          logger.info(`세션 만료 여부: ${user.sessionExpiresAt}`,'socketConnection.js');
          socket.emit("error", {
            code: "SESSION_EXPIRED",
            message: "세션이 만료되었습니다. 방에 입장할 수 없습니다.",
          });
          return; // 세션이 만료되었으므로 추가 작업을 수행하지 않음
        }

        // logger.info("타임아웃id 보낼 때 timeoutId"+user.timeoutId,22222222222222 )
        console.log("타임아웃 전")
        if (user.timeoutId) {
          // logger.info("타임아웃id 보낼 때 timeoutId"+user.timeoutId,11111111111 )
          clearTimeout(user.timeoutId);
          logger.info(`소켓에서 User ${user.nickName}의 timeout을 지웠습니다 .`,'socketconnection.js');
          // logger.info("소켓에서 타임아웃 해제됨:"+user.timeoutId,11111111111);

          user.timeoutId = null;
          // logger.info("timeoutId 클라이언트에 보냄:");
        }

        user.socketId = socket.id;
        user.roomName = roomName;
        // const roomName = user.roomName;

        logger.info(`Client (${user.nickName}) called 'enter_room'.`);
        

        const ipAddress =
          socket.request.headers["x-forwarded-for"] ||
          socket.request.connection.remoteAddress;

        console.log(`방에 들어온 사용자 정보:`, {
          id: user.id,
          nickName: user.nickName,
          socketId: user.socketId,
          roomName: user.roomName,
          ipAddress: ipAddress,
        });

        // logger.info(`ip주소: ${ipAddress}`,'socketConnection.js');

        logger.info(`${user.nickName} has joined ${user.roomName}`);

        //방이 없을 경우 방을 새로 만들어서 rooms 배열에 업데이트
        let room = rooms.find((room) => room.name === roomName);

        if (!Array.isArray(roomUsers[roomName])) {
          roomUsers[roomName] = []; // 배열로 만들어주고, 빈 배열로 초기화
        }

        // 사용자 ID를 배열에 추가
        logger.info("enter_room: 사용자를 roomUsers에 잘 추가했습니다.1")
        roomUsers[roomName].push(user.id);
        logger.info("enter_room: 사용자를 roomUsers에 잘 추가했습니다.2")

        logger.info(`소켓에서 user.roomName: ${user.roomName}`, 'socketConnection.js')
        socket.join(user.roomName); //해당 소켓을 특정 방에 추가

        room.count = roomUsers[roomName].length;
      
        logger.info(`enter_room 때 ${roomName}에 있는 사람 수: ${roomUsers[roomName].length} 명`, 'socketConnection.js')

        // logger.info(`세션 만료 여부: ${user.sessionExpiresAt}`,'socketConnection.js');
        io.to(roomName).emit("roomCountUpdate", room.count);

        logger.info(`현재 방 사용자 정보(roomUsers) [방에 있는 사용자 ID]:${JSON.stringify(roomUsers[roomName])}`,'socketConnection.js')


        // console.log("방 정보:", room );
        socket.emit("room_details", room);
        io.to(roomName).emit("room_details", room);
        // console.log("업데이트된 방 정보 전달:", room)
        io.to(roomName).emit("newRoomInfo", room);

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

    socket.on('room_updated', (data) => {
      const { originalName, updatedName, updatedMaxCount, updatedPassword, updatedIsPrivate } = data;

      let roomIndex = rooms.findIndex(
        (room) => room.name === originalName
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

        logger.info(`업데이트된 방 정보 받은 후 방 정보: ${JSON.stringify(updatedRoomData)}`,'socketConnection.js');

        io.to(originalName).emit('newRoomInfo', updatedRoomData);
    }
  })

    // //유저 메시지 접수 및 소켓들에 보내주기
    //socket id, message id, roomName, message, date 받아오기
    socket.on("message", (message, roomName) => {

      const userCheck = userInfo.find(
        (check) => check.user.socketId === socket.id
      );

      // socket.to(roomName).emit('reply', message, userCheck.user.nickName);
      // if (userCheck) {
      // io.to(roomName).emit('reply', message, userCheck.user.nickName);
      // }

      // messages.push(message);
      //   // console.log('Updated messages array:', messages);

      socket.to(roomName).emit('reply', message);
      logger.info("Received message from client: " + message);
      logger.info("Received message from client room: " + roomName);
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
      logger.info("disconnect: 소켓연결이 끊어졌습니다.", "socketConnection.js")
      const userCheck = userInfo.find(
        (check) => check.user.socketId === socket.id
      );

      if (userCheck) {
        const user = userCheck.user;
        logger.info("A client has disconnected");
        const roomName = user.roomName; // 사용자 객체에서 방 이름 찾기

        // console.log("Room Name:", roomName);

        if (roomName) {
          const room = rooms.find((room) => room.name === roomName);
          if (room) {
            if (!Array.isArray(roomUsers[roomName])) {
              // roomUsers[roomName]이 배열이 아닐 경우, 빈 배열로 초기화
              roomUsers[roomName] = [];
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
            } else {
              //채팅방 실 사용자 관리 배열 업데이트
              socket.broadcast.to(roomName).emit("reply", `${user.nickName}님이 방을 나갔습니다.`, "알리미");
            }
            //방장이든 일반유저든 상관없이 공통으로
            roomUsers[roomName] = roomUsers[roomName].filter((id) => id !== user.id);
            room.count = roomUsers[roomName].length;
            logger.info(`방에 남아있는 사람 ID - roomUsers:${JSON.stringify(roomUsers)}`, 'socketConnection.js');
            logger.info(`${roomName}에 남아있는 사람 수: ${room.count || 0} 명`, 'socketConnection.js');
            io.to(roomName).emit("roomCountUpdate", room.count);
          }

          const extendMin = 15
          user.sessionExpiresAt = new Date(Date.now() + extendMin * 60000);

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
          logger.info(`방 삭제 후 rooms 배열:${rooms}`, 'socketConnection.js')
        }

        // roomUsers = rooms.filter((room) => room.name !== roomName);
        delete roomUsers[roomName]

        io.to(roomName).emit("roomDeleted", "방장이 방을 삭제했습니다.");
    });
  });
}
