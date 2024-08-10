import React, { useState, useEffect, useRef } from "react"

import '../../CSS/ChatFrame.css';
import io from 'socket.io-client';
import InfoBar from "./InfoBar"
import MessageContainer from "./MessageContainer"
import TextContainer from "./TextContainer"

export default function ChatFrame(props) {
    
    console.log('ChatFrame Rerendered');
    
    const [messages, setMessages] = useState([]);
    const [roomName, setRoomName] = useState(props.roomName);
    const [nickName, setNickName] = useState(props.nickName);
    
    
    console.log('ChatFrame roomName>>',roomName);
    console.log('ChatFrame nickName>>',nickName);

    const socket = useRef(null);
    
    useEffect(() => {
      socket.current = io('http://192.168.0.113:5050');
        socket.current.on('connect', () => {
          console.log('Connected to server');
          // 룸 입장 emit
          socket.current.emit('enter_room', nickName, roomName);
        });
        
        // 서버 메세지 대기
        socket.current.on('reply', (reply_message, nickName) => {
          console.log('From server ::', reply_message);

          // 채팅 메세지 업데이트
          setMessages((prevMessages) => [
            ...prevMessages,
            { 
              nickName: nickName,
              text: reply_message,
            },
          ]);


        });
    
        return () => {
          socket.current.disconnect(); // 컴포넌트 언마운트 시 연결 종료
        };
    }, []);

    return (
            <div className="ChatFrame">
                <InfoBar roomName={roomName}/>
                <MessageContainer messages={messages}/>               
                <TextContainer socket={socket} setMessages={setMessages} nickName={nickName} roomName={roomName}/>
            </div>
    );
    
};




