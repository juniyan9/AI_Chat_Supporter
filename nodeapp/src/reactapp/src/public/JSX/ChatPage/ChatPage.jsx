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

    const socket = useRef(null); // 소켓 연결을 위한 ref
    const roomId = location.state?.roomId; // roomId를 사용
    const currentUserName = location.state?.nickName;

    useEffect(() => {
        // 소켓 연결 설정
        socket.current = io('http://43.203.141.146:5050');
        
        // 서버에 방 입장 요청
        socket.current.on('connect', () => {
            socket.current.emit('enter_room', currentUserName, roomName);
        });

        // 서버로부터 방 정보를 받는 이벤트 처리
        socket.current.on('room_details', (roomDetails) => {
            console.log(roomDetails.room.ownerNickname);
            setOwnerNickname(roomDetails.room.ownerNickname); // 서버에서 받은 방장 닉네임 업데이트
            setRoomName(roomDetails.room.name); // 방 이름이 변경되었을 수 있음
            setMaxCount(roomDetails.room.maxCount);
            setPassword(roomDetails.room.password);
            setIsPrivate(roomDetails.room.isPrivate);
        });

        // 서버로부터 사용자 수(roomCount) 업데이트 받기
        socket.current.on('roomCountUpdate', (count) => {
            setRoomCount(count); // roomCount 업데이트
        });

        // 서버로부터 메시지(reply) 받기
        socket.current.on('reply', (reply_message, senderNickName) => {
            setMessages(prevMessages => [
                ...prevMessages,
                { nickName: senderNickName, text: reply_message },
            ]);
        });

        // 소켓 연결 해제
        return () => {
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null;
            }
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
                />
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
                />
            )}
        </div>
    );
}
