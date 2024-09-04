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

});





import { spawn } from "child_process";

const model_call = () => {
 
  const result = spawn('py', ['./model_call.py', '안녕하세요']);
  result.stdout.on('data', (data) => { 
    console.log('model_call stdout ::::',data.toString());
  });

  result.stderr.on('data', (data) => {
    console.log('model_call stderr ::::',data.toString());
  });
   
}

model_call();



export { app, io };


// * NodeJS declaration */
// import express from 'express';
// import customLogger from './class/customLogger.js'
// import userObj from './class/user.js'
// import roomObj from './class/room.js'
// import path from 'path';
// import cors from 'cors';
// import * as url from 'url';

// let app = express();

// const logger = new customLogger();

// /* WebSocker declaration */
// import { createServer } from "http";
// import { Server } from "socket.io";


// const httpServer = createServer();
// const io = new Server(httpServer, { cors: '*' });


// /* NodeJS implementation */

// // Set filePath
// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// /* middleware */
// //app.use('요청 경로', express.static('실제 경로'));
// //app.use('/', express.static(path.join(__dirname, 'reactapp/build')));
// app.use('/', express.static(__dirname));
// //app.use(express.static(path.join(__dirname, 'reactapp/build/static')));
// // parse requests of content-type - application/json
// app.use(express.json());
// // parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));

// app.use(cors({ cors: '*' }));




// app.get('/', (req, res) => {
//   res.readFile("index.html")
// });

// /*
  
// */

// let room =[
//     { 
//       id : 0,
//       name: 'room1',  
//       count: 1,
//       maxCount: 10,
//     },
//     { 
//       id : 1,
//       name: 'room2',  
//       count: 3,
//       maxCount: 7,
//     }
//   ];
// let users = {};



// app.get('/chatList', (req, res) => {
//   res.send(room);
// });



// /* WebSocker implementation */

// const WS_port = 5050;
// httpServer.listen(WS_port, () => {
//   console.log('WebSocket listening at port %d', WS_port);  
// });

// //events
// io.on("connection", (socket) => {
//   logger.info('Client connected');

//   socket.on('enter_room', (nickName, roomName) => {

//     users[socket.id] = {nickName, roomName};

//     logger.info('UserName >>'+ users[socket.id].nickName);
    
//     socket.join(roomName);
//     logger.info(users[socket.id].nickName + 'Client joined to ' + roomName);
    
//     socket.in(roomName).emit("reply", users[socket.id].nickName, "welcome");
//   });
  
//   socket.on('message', (message, roomName) => { 
//     logger.info('Received message from client:' + message);
//     logger.info('Received message from client room:' + roomName);

//     const user = users[socket.id];
//     if (user) {
//       socket.to(roomName).emit('reply', message ,users[socket.id].nickName, message);
//     }
//   });

//   socket.on('disconnect', (roomName) => {
//     const user = users[socket.id];
//     if (user) {
//         logger.info('A client disconnected');
//         io.to(roomName).emit('message', `${user.nickName} has left the room`);
//         delete users[socket.id];
//     }
//   });

// });


// export {app, io};


