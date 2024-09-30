import React, { useState,useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../../CSS/ChatPage.css';
import ChatFrame from './ChatFrame';
import LogFrame from './LogFrame';
import Chatlistpage from '../ChatListPage/ChatListPage';


export default function ChatPage() {
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [selectedRoom,setSelectedRoom]= useState(null);
    const [isPrivate, setIsPrivate] = useState(false);// 초기 비공개 여부 설정
    const [roomCount, setRoomCount] = useState(0);
    const [roomName, setRoomName] = useState(null);
    const [maxCount, setMaxCount] = useState(2); // 초기 최대 인원 설정
    const [password, setPassword] = useState(''); // 초기 비밀번호 설정

    const location = useLocation();
    const UserName = location.state?.nickName;

    let socket = useRef(null); // 소켓 연결을 위한 ref


    const handleSelectRoom = (room) =>{
        setSelectedRoom(room)
    }
    
    return (
        <div className="chatPage">
        <Chatlistpage
            onSelectedRoom={handleSelectRoom}
            UserName={UserName}
            socket={socket}
            roomName={roomName}
            setRoomName={setRoomName}
            password={password}
            setPassword={setPassword}
            isPrivate={isPrivate}
            setIsPrivate={setIsPrivate}
            maxCount={maxCount}
            setMaxCount={setMaxCount}
            setIsSocketConnected={setIsSocketConnected}
            isSocketConnected={isSocketConnected}
        />
            <div className="chatFrameContainer">
                <ChatFrame
                    UserName={UserName}
                    location={location}
                    room={selectedRoom}
                    socket={socket}
                    roomCount={roomCount}
                    setRoomCount={setRoomCount}
                    roomName={roomName}
                    setRoomName={setRoomName}
                    password={password}
                    setPassword={setPassword}
                    isPrivate={isPrivate}
                    setIsPrivate={setIsPrivate}
                    maxCount={maxCount}
                    setMaxCount={setMaxCount}
                    setIsSocketConnected={setIsSocketConnected}
                />
            </div>
            <LogFrame />
        </div>
    );
}
