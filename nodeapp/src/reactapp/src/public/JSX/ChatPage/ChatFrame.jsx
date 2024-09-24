import React, { useEffect, useState, useRef } from "react";
import '../../CSS/ChatFrame.css';
import io from 'socket.io-client';
import InfoBar from "./InfoBar";
import MessageContainer from "./MessageContainer";
import TextContainer from "./TextContainer";
import { useNavigate } from "react-router-dom";

export default function ChatFrame({ roomName,roomCount, maxCount, nickName, isPrivate, messages, password,socket,setMessages,updatedRoomName}) {
    const [onsearchtext, setonSearchText] = useState('');

    //const socket = useRef(null);
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동

    return (
        <div className="ChatFrame">
            <InfoBar
                roomName={roomName} // 업데이트된 . 방이름 사용
                setonsearchtext={setonSearchText}
                roomCount={roomCount}
                maxCount = {maxCount}      // 업데이트된 최대 인원수 사용
                isPrivate={isPrivate}      // 업데이트된 비공개 여부 사용
                password={password}
            />
            <MessageContainer
                messages={messages}
                onsearchtext={onsearchtext}
            />
            <TextContainer 
                socket={socket} 
                setMessages={setMessages} 
                nickName={nickName} 
                roomName={roomName || updatedRoomName} // 변경된 방 이름 전달  
            />
        </div>
    );
}
