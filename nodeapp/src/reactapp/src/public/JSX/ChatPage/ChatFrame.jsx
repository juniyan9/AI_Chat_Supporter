import React from 'react';
import {useState} from 'react';
import '../../CSS/ChatFrame.css';
import InfoBar from './InfoBar';
import MessageContainer from './MessageContainer';
import TextContainer from './TextContainer';

export default function ChatFrame({ roomName, nickName,setMessages, maxCount, password, isPrivate, messages, roomCount, socket }) {
    const [onsearchtext, setonSearchText] = useState('');
    return (
        <div className="ChatFrame">
            <InfoBar
                roomName={roomName}
                setonsearchtext={setonSearchText}
                roomCount={roomCount} // 사용자 수 표시
            />
            <MessageContainer
                messages={messages} // 메시지 목록 표시
                onsearchtext={onsearchtext}
            />
            <TextContainer
                setMessages={setMessages}
                nickName={nickName}
                roomName={roomName}
                socket={socket}
            />
        </div>
    );
}
