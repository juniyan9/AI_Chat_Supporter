/* NodeJS declaration */
import express from 'express';
import customLogger from './class/customLogger.js'
import user from './class/user.js'
import path from 'path';
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


app.get('/', (req, res) => {
  res.readFile("index.html")
});

let roomName
let users = {};



/* WebSocker implementation */

const WS_port = 5050;
httpServer.listen(WS_port, () => {
  console.log('WebSocket listening at port %d', WS_port);  
});

//events
io.on("connection", (socket) => {
  logger.info('Client connected');

  socket.on('enter_room', (name, roomName) => {

    users[socket.id] = {name, roomName};

    logger.info('UserName >>'+ users[socket.id].name);
    
    socket.join(roomName);
    logger.info('Client joined to ' + roomName);
    socket.to(roomName).emit("reply","welcome");
  });
  
  socket.on('message', (message, roomName) => {
    logger.info('Received message from client:' + message);
    logger.info('Received message from client room:' + roomName);

    const user = users[socket.id];
    if (user) {
      socket.to(roomName).emit('reply', users[socket.id].name, message);
    }
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
        logger.info('A client disconnected');
        io.to(user.room).emit('message', `${user.name} has left the room`);
        delete users[socket.id];
    }
  });

});


export {app, io};