import React, { useEffect, useState, useRef } from "react";
import '../../CSS/ChatFrame.css';
import io from 'socket.io-client';
import InfoBar from "./InfoBar";
import MessageContainer from "./MessageContainer";
import TextContainer from "./TextContainer";

export default function ChatFrame({ roomName, nickName, maxCount, password, isPrivate }) {
    const [messages, setMessages] = useState([]);
    const [onsearchtext, setonSearchText] = useState('');
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io('http://43.203.141.146:5050');
        socket.current.on('connect', () => {
            socket.current.emit('enter_room', nickName, roomName);
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
