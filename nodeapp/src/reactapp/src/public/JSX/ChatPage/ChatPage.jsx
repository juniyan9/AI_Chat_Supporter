import React, { useEffect, useState, useRef } from 'react';
import '../../CSS/ChatPage.css';
import ChatFrame from './ChatFrame';
import LogFrame from './LogFrame';
import { useLocation } from 'react-router-dom';
import RoomSettingsModal from './RoomSettingsModal';
import io from 'socket.io-client'; // 소켓 연결 추가

export default function ChatPage() {
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [ownerNickname, setOwnerNickname] = useState(''); // 방장 이름을 상태로 관리
    const [isOwner, setIsOwner] = useState(false); // 방장 여부 상태 추가
    const [roomName, setRoomName] = useState(location.state?.roomName || '기본 방 이름');
    const [maxCount, setMaxCount] = useState(10); // 초기 최대 인원 설정
    const [password, setPassword] = useState(''); // 초기 비밀번호 설정
    const [isPrivate, setIsPrivate] = useState(false); // 초기 비공개 여부 설정
    const [messages, setMessages] = useState([]); // 메시지 상태
    const [roomCount, setRoomCount] = useState(0); // 사용자 수 상태

    let socket = useRef(null); // 소켓 연결을 위한 ref
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    const roomId = location.state?.roomId; // roomId를 사용
    const currentUserName = location.state?.nickName;

    useEffect(() => {
        if(!socket.current){
            socket.current = io('http://localhost:5050');

            socket.current.on('connect', () => {
                setIsSocketConnected(true);
                socket.current.emit('enter_room', currentUserName, roomName);
            })
            

        }
        // 소켓 연결 해제
        return () => {
            socket.current.close();
        };
    }, [currentUserName, roomId]);

    useEffect(() => {
        // 방장 여부 설정
        setIsOwner(currentUserName === ownerNickname);
    }, [currentUserName, ownerNickname]);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    // 방 정보 업데이트 핸들러
    const handleUpdateRoom = (updatedRoomDetails) => {
        setRoomName(updatedRoomDetails.name);
        setMaxCount(updatedRoomDetails.maxCount);
        setPassword(updatedRoomDetails.password);
        setIsPrivate(updatedRoomDetails.isPrivate);
    };

    return (
        <div className="chatPage">
            
            <div className="chatFrameContainer">
                {isOwner && (
                    <button onClick={handleOpenModal} className="settingsButton">
                        방 설정
                    </button>
                )}
                {isSocketConnected ? (
                <ChatFrame 
                    roomName={roomName} 
                    nickName={currentUserName} 
                    maxCount={maxCount}
                    password={password}
                    isPrivate={isPrivate}
                    messages={messages} // 메시지 전달
                    roomCount={roomCount} // 방의 사용자 수 전달
                    setMessages={setMessages} // setMessages 전달
                    socket={socket}
                    setOwnerNickName={setOwnerNickname}
                />
                ) : (<p>Connecting to WebSocket...</p>)}
            </div>
            <LogFrame />
            
           {isOwner && (
                <RoomSettingsModal
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    roomDetails={{ 
                        name: roomName,
                        maxCount: maxCount,
                        password: password,
                        isPrivate: isPrivate,
                        ownerNickname: ownerNickname
                    }}
                    onUpdate={handleUpdateRoom}
                    socket={socket}
                    isSocketConnected={isSocketConnected}
                />
        
            )}
            
        </div>
    );
}
