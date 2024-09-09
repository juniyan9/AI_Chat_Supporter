import React, { useEffect, useState, useRef } from "react";
import '../../CSS/ChatFrame.css';
import io from 'socket.io-client';
import InfoBar from "./InfoBar";
import MessageContainer from "./MessageContainer";
import TextContainer from "./TextContainer";

export default function ChatFrame({ roomName, nickName, maxCount, password, isPrivate }) {
    const [messages, setMessages] = useState([]);
    const [onsearchtext, setonSearchText] = useState('');
    const [roomCount, setRoomCount] = useState(0); //roomCount 상태 추가
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io('http://43.203.141.146:5050');
        socket.current.on('connect', () => {
            socket.current.emit('enter_room', nickName, roomName);
        });

        // 서버로부터 사용자 수(roomCount) 업데이트 받기
        socket.current.on('roomCountUpdate', (count) => {
            setRoomCount(count); // roomCount 업데이트
        });

        socket.current.on('reply', (reply_message, nickName) => {
            setMessages(prevMessages => [
                ...prevMessages,
                { nickName, text: reply_message },
            ]);
        });

        return () => {
            socket.current.disconnect();
        };
    }, [nickName, roomName]);

    return (
        <div className="ChatFrame">
            <InfoBar
                roomName={roomName}
                setonsearchtext={setonSearchText}
                roomCount={roomCount}
                />
            <MessageContainer
                messages={messages}
                onsearchtext={onsearchtext} 
                />
            <TextContainer 
                socket={socket} 
                setMessages={setMessages} 
                nickName={nickName} 
                roomName={roomName} 
            />
        </div>
    );
}
