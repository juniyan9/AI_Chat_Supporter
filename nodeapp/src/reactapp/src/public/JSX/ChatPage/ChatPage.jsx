import React, { useEffect, useState } from 'react';
import '../../CSS/ChatPage.css';
import ChatFrame from './ChatFrame';
import LogFrame from './LogFrame';
import { useLocation } from 'react-router-dom';
import RoomSettingsModal from './RoomSettingsModal';

export default function ChatPage(props) {
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [roomName, setRoomName] = useState(location.state?.roomName || '기본 방 이름');
    const [maxCount, setMaxCount] = useState(10); // 초기 최대 인원 설정
    const [password, setPassword] = useState(''); // 초기 비밀번호 설정
    const [isPrivate, setIsPrivate] = useState(false); // 초기 비공개 여부 설정

    const currentUserName = location.state?.nickName;
    const roomOwnerName = location.state?.ownerNickname || currentUserName;

    useEffect(() => {
        setIsOwner(currentUserName === roomOwnerName);
    }, [currentUserName, roomOwnerName]);
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
                        ownerNickname: roomOwnerName
                    }}
                    onUpdate={handleUpdateRoom}
                    onDelete={handleDeleteRoom}
                />
            )}
        </div>
    );
}
