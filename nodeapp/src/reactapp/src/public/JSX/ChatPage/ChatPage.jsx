import React, { useEffect, useState } from 'react';
import '../../CSS/ChatPage.css';
import ChatFrame from './ChatFrame';
import LogFrame from './LogFrame';
import { useLocation } from 'react-router-dom';
import RoomSettingsModal from './RoomSettingsModal';
import { io } from 'socket.io-client';

export default function ChatPage(props) {
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [ownerNickname, setOwnerNickName] = useState(''); // 방장 이름을 상태로 관리
    const [roomName, setRoomName] = useState(location.state?.roomName || '기본 방 이름');
    const [maxCount, setMaxCount] = useState(10); // 초기 최대 인원 설정
    const [password, setPassword] = useState(''); // 초기 비밀번호 설정
    const [isPrivate, setIsPrivate] = useState(false); // 초기 비공개 여부 설정

    const currentUserName = location.state?.nickName;
    const socket = io('http://43.203.141.146:5050');

    useEffect(() => {
        // //방의 입장하며 방장 정보를 요청
        // socket.emit('enter_room', currentUserName, roomName);

        // 서버에서 방장 정보를 받아오는 이벤트 리스너
        socket.on('room_details',({ownerNickname}) => {
            console.log("ownerNickName:",ownerNickname);
            setOwnerNickName(ownerNickname);
        });

        return () => {
            socket.disconnect();
        };
    }, [currentUserName, roomName]);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    // 방 정보 업데이트 핸들러
    const handleUpdateRoom = (updatedRoomDetails) => {
        setRoomName(updatedRoomDetails.name);
        setMaxCount(updatedRoomDetails.maxCount);
        setPassword(updatedRoomDetails.password);
        setIsPrivate(updatedRoomDetails.isPrivate);
    };

    const handleDeleteRoom = (roomName) => {
        console.log('Deleted Room:', roomName);
        // 방 삭제 후 상태 처리
    };

    return (
        <div className="chatPage">
            <div className="chatFrameContainer">
                {currentUserName === ownerNickname && (
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
                />
            </div>
            <LogFrame />
            {currentUserName === ownerNickname && (
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
                    onDelete={handleDeleteRoom}
                />
            )}
        </div>
    );
}
