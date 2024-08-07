import React, { useState, useEffect, useRef } from "react"

import '../CSS/ChatFrame.css';
import io from 'socket.io-client';
import InfoBar from "./InfoBar"
import MessageContainer from "./MessageContainer"
import TextContainer from "./TextContainer"

export default function ChatFrame(props) {
    
    console.log('ChatFrame Rerendered');
    
    const [messages, setMessages] = useState([]);
    const [roomName, setRoomName] = useState(props.room);
    const [name, setName] = useState(props.name);
    
    
    console.log('ChatFrame roomName>>',roomName);

    const socket = useRef(null);
    
    useEffect(() => {
      socket.current = io('http://192.168.0.108:5050');
        socket.current.on('connect', () => {
          console.log('Connected to server');
          
          // 룸 입장 emit
          socket.current.emit('enter_room', name, roomName);
        });
        
        
        
        // 서버 메세지 대기
        socket.current.on('reply', (name, reply_message) => {
          console.log('From server ::', reply_message);

          // 채팅 메세지 업데이트
          setMessages((prevMessages) => [
            ...prevMessages,
            { 
              name: name,
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
                <InfoBar />
                <MessageContainer messages={messages}/>               
                <TextContainer socket={socket} setMessages={setMessages} name={name}/>
            </div>
    );
    
};




