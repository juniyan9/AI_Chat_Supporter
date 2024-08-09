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
//app.use('/', express.static(path.join(__dirname, 'reactapp/build')));
app.use('/', express.static(__dirname));
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

let room =[
    { 
      id : 0,
      name: 'room1',  
      count: 1,
      maxCount: 10,
    },
    { 
      id : 1,
      name: 'room2',  
      count: 3,
      maxCount: 7,
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

//events
io.on("connection", (socket) => {
  logger.info('A Client connected');

  socket.on('enter_room', (nickName, roomName) => {

    users[socket.id] = {nickName, roomName};
        logger.info(`Client (${users[socket.id].nickName}) enter_room called`);

    socket.join(roomName);
        logger.info(`${users[socket.id].nickName} joined to ${roomName}`);

    socket.broadcast.in(roomName).emit("reply", users[socket.id].nickName, "welcome");
  });

  socket.on('message', (message, roomName) => { 
    logger.info('Received message from client:' + message);
    logger.info('Received message from client room:' + roomName);

    const user = users[socket.id];
    if (user) {
      socket.to(roomName).emit('reply', message , users[socket.id].nickName);
    }
  });

  socket.on('disconnect', (roomName) => {
    const user = users[socket.id];
    if (user) {
        logger.info('A client disconnected');
        io.to(roomName).emit('message', `(${user.nickName}) has left the room`);
        delete users[socket.id];
    }
  });

});


export {app, io};