import React, { useState,useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../../CSS/ChatPage.css';
import chaticon  from '../../IMG/chaticon.png';
import ChatFrame from './ChatFrame';
import LogFrame from './LogFrame';
import ChatListFrame from './ChatListFrame';



export default function ChatPage() {
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [selectedRoom,setSelectedRoom]= useState(null);
    const [isPrivate, setIsPrivate] = useState(false);// 초기 비공개 여부 설정
    const [roomCount, setRoomCount] = useState(0);
    const [roomName, setRoomName] = useState(null);
    const [maxCount, setMaxCount] = useState(0); // 초기 최대 인원 설정
    const [password, setPassword] = useState(''); // 초기 비밀번호 설정
    const [timeoutId, setTimeoutId] = useState(0);
    const [count, setCount] = useState(0);
    const [ownerNickname, setOwnerNickName] = useState('');
    const [AIAnalysisResult, setAIAnalysisResult] = useState(null);
    // const [test,settest] =useState("00:00");

    const location = useLocation();
    const UserName = location.state?.nickName;

    let socket = useRef(null); // 소켓 연결을 위한 ref
    // console.log("chatpage룸네임22",roomName);


    const handleSelectRoom = (room) =>{
        setSelectedRoom(room);
        setRoomName(room.name);
    }
    
    
    return (
        <div className="chatPage">
            <ChatListFrame
                onSelectedRoom={handleSelectRoom}
                UserName={UserName}
                roomName={roomName}
                setRoomName={setRoomName}
                password={password}
                setPassword={setPassword}
                isPrivate={isPrivate}
                setIsPrivate={setIsPrivate}
                roomCount={roomCount}
                maxCount={maxCount}
                setMaxCount={setMaxCount}
                setIsSocketConnected={setIsSocketConnected}
                isSocketConnected={isSocketConnected}
                timeoutId={timeoutId}
                setTimeoutId={setTimeoutId}
                count={count}
                setCount={setCount}
                setOwnerNickName={setOwnerNickName}
                ownerNickname={ownerNickname}
            />
            <div className="chatFrameContainer">
                {isSocketConnected ?
                    <ChatFrame
                        UserName={UserName}
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
                        timeoutId={timeoutId}
                        setTimeoutId={setTimeoutId}
                        ownerNickname={ownerNickname}
                        setOwnerNickName={setOwnerNickName}
                        AIAnalysisResult={AIAnalysisResult}
                        setAIAnalysisResult={setAIAnalysisResult}
                        setIsSocketConnected={setIsSocketConnected}
                    />:<div className='WaitingFrame'>
                        <img src={chaticon}/>
                        여러 사람들과 소통해보세요.
                    </div>
                }                
            </div>
            <LogFrame 
            AIAnalysisResult={AIAnalysisResult} />

        </div>
    );
}
