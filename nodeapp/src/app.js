/* NodeJS declaration */
import express from 'express';
import customLogger from './class/customLogger.js'
import userObj from './class/user.js'
import roomObj from './class/room.js'
import path from 'path';
import cors from 'cors';
import * as url from 'url';

let app = express();

const logger = new customLogger();

/* WebSocker declaration */
import { createServer } from "http";
import { Server } from "socket.io";


const httpServer = createServer();
const io = new Server(httpServer, { cors: '*' });


/* NodeJS implementation */

// Set filePath
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

/* middleware */
//app.use('요청 경로', express.static('실제 경로'));

app.use('/', express.static(path.join(__dirname, 'reactapp/build')));
// app.use('/', express.static(__dirname));

//app.use(express.static(path.join(__dirname, 'reactapp/build/static')));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(cors({ cors: '*' }));



app.get('/', (req, res) => {
  res.readFile("index.html")
});

/*
  
*/

let room = [
  {
    id: 0,
    name: 'room1',
    count: 1,
    maxCount: 10,
    password: '1111'
  },
  {
    id: 1,
    name: 'room2',
    count: 3,
    maxCount: 7,
    password: '2222'
  }
];

let users = {};



app.get('/chatList', (req, res) => {
  res.send(room);
});



/* WebSocker implementation */

const WS_port = 5050;
httpServer.listen(WS_port, () => {

  console.log('WebSocket listening at port %d', WS_port);
});

const PORT = 3000;

let roomUserCounts = {};
let nickNames = new Set ();
let roomUsers = {};

//events
io.on("connection", (socket) => {
  logger.info('A Client has connected');

  // socket.on('enter_room', (nickName, roomName, cb = () => {}) => {
  socket.on('enter_room', (nickName, roomName) => {


    if (nickNames.has(nickName)) {  //enter_room 전에 넣어야함.
      cb ({error: '이미 사용중인 닉네임입니다.'});
      return;   //위 조건에 걸리면 나머지 코드 실행하지 않고 함수 종료.
      logger.info(`ID (${socket.id})가 중복된 닉네임 (${nickName}) 사용.`);
    }

    nickNames.add(nickName);  //사용되지 않은 닉네임인 경우 nickNames에 저장.
    users[socket.id] = { nickName, roomName };  //socket.id를 키로 하여 users 객체에 닉네임과 방 이름 저장.
    console.log('Type of socket.id:', typeof socket.id);
    console.log('Type of nickName:', typeof nickName);
    console.log('Type of roomName:', typeof roomName);

    logger.info(`Client (${users[socket.id].nickName}) called 'enter_room'.`);

    socket.join(roomName);  //해당 소켓을 특정 방에 추가
    logger.info(`${users[socket.id].nickName} has joined ${roomName}`);
    

    if (!roomUserCounts[roomName]) {
      roomUserCounts[roomName] = 0;
    }

    roomUserCounts[roomName] += 1;

    console.log(`${ roomName }에 남아있는 사람 수는 ${ roomUserCounts[roomName] || 0} 명입니다.`)


    socket.emit("reply", `${users[socket.id].nickName}님이 입장하셨습니다. 반갑습니다.`, "관리자봇");   // 나도 웰컴 메시지 확인할 수 있게 수정.

    // socket.broadcast.in(roomName).emit("reply", "welcome", users[socket.id].nickName);  //broadcast: 현재 소켓(클라이언트)을 제외한 다른 소켓들에게만 메시지 보냄.
    socket.broadcast.in(roomName).emit("reply", `${users[socket.id].nickName}님이 입장하셨습니다. 반갑습니다.`, "관리자봇");

  if (!roomUsers[roomName]) {
      roomUsers[roomName] = [];
  }
  roomUsers[roomName].push(nickName);
  io.to(roomName).emit('user_count_update', roomUsers[roomName].length);
  });

  
  });

  socket.on('message', (message, roomName) => {

  
    logger.info('Received message from client:' + message);
    logger.info('Received message from client room:' + roomName);

    const user = users[socket.id];
    if (user) {
      socket.to(roomName).emit('reply', message, users[socket.id].nickName);
    }
  });


  socket.on('disconnect', (roomName) => {   
    const user = users[socket.id];
    if (user) {
      logger.info('A client has disconnected');

      if (roomUserCounts[roomName]) {
        roomUserCounts[roomName] -= 1;
      }
       
      console.log(`${ roomName }에 남아있는 사람 수는 ${ roomUserCounts[roomName] || 0 } 명입니다.`)

      io.to(roomName).emit('message', `(${user.nickName}) 님이 방을 나가셨습니다.`);
      socket.broadcast.to(roomName).emit('message', `(${user.nickName}) 님이 방을 나가셨습니다.`);

      delete users[socket.id];

      
    }
  });





export { app, io };


/* NodeJS declaration */
// import express from 'express';
// import customLogger from './class/customLogger.js';
// import path from 'path';
// import cors from 'cors';
// import * as url from 'url';
// import { createServer } from 'http';
// import { Server } from 'socket.io';

// // Create the Express app
// const app = express();
// const logger = new customLogger();

// // Create an HTTP server and attach Socket.IO
// const httpServer = createServer(app);
// const io = new Server(httpServer, { cors: '*' });

// // Set filePath
// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// // Middleware
// app.use('/', express.static(path.join(__dirname, 'reactapp/build')));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// // Serve the main page
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'reactapp/build/index.html'));
// });

// // Sample room data
// let rooms = [
//   {
//     id: 0,
//     name: 'room1',
//     count: 1,
//     maxCount: 10,
//     password: '1111',
//   },
//   {
//     id: 1,
//     name: 'room2',
//     count: 3,
//     maxCount: 7,
//     password: '2222',
//   },
// ];

// // Endpoint to get the list of rooms
// app.get('/chatList', (req, res) => {
//   res.send(rooms);
// });

// /* WebSocket implementation */

// const WS_PORT = 5050;
// httpServer.listen(WS_PORT, () => {
//   console.log(`WebSocket listening at port ${WS_PORT}`);
// });

// const PORT = 3000;
// const roomUserCounts = {}; // To track user count per room
// const users = {}; // To map socket ID to user data
// const nickNames = new Set(); // To ensure unique nicknames

// // WebSocket events
// io.on('connection', (socket) => {
//   logger.info('A Client has connected');

//   // Event for entering a room
//   socket.on('enter_room', (nickName, roomName, cb = () => {}) => {
//     if (nickNames.has(nickName)) {
//       cb({ error: '이미 사용중인 닉네임입니다.' });
//       return;
//     }

//     nickNames.add(nickName);
//     users[socket.id] = { nickName, roomName };

//     socket.join(roomName);

//     if (!roomUserCounts[roomName]) {
//       roomUserCounts[roomName] = 0;
//     }

//     roomUserCounts[roomName] += 1;

//     logger.info(`${nickName} has joined ${roomName}`);
//     socket.emit('reply', `${nickName}님이 입장하셨습니다. 반갑습니다.`, '관리자봇');
//     socket.broadcast.to(roomName).emit('reply', `${nickName}님이 입장하셨습니다. 반갑습니다.`, '관리자봇');
//   });

//   // Event for sending a message
//   socket.on('message', (message, roomName) => {
//     logger.info(`Received message from client: ${message}`);
//     logger.info(`Received message from room: ${roomName}`);

//     const user = users[socket.id];
//     if (user) {
//       socket.to(roomName).emit('reply', message, user.nickName);
//     }
//   });

//   // Event for disconnecting
//   socket.on('disconnect', () => {
//     const user = users[socket.id];
//     if (user) {
//       logger.info('A client has disconnected');

//       const roomName = user.roomName;
//       if (roomUserCounts[roomName]) {
//         roomUserCounts[roomName] -= 1;
//       }

//       logger.info(`${roomName}에 남아있는 사람 수는 ${roomUserCounts[roomName] || 0} 명입니다.`);

//       io.to(roomName).emit('message', `(${user.nickName}) 님이 방을 나가셨습니다.`);
//       socket.broadcast.to(roomName).emit('message', `(${user.nickName}) 님이 방을 나가셨습니다.`);

//       nickNames.delete(user.nickName);
//       delete users[socket.id];
//     }
//   });
// });

// export { app, io };


