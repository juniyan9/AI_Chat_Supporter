import React, { useEffect, useState, useRef } from 'react';
import '../../CSS/ChatPage.css';
import ChatFrame from './ChatFrame';
import LogFrame from './LogFrame';
import { useLocation } from 'react-router-dom';
import RoomSettingsModal from './RoomSettingsModal';

export default function ChatPage() {
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [ownerNickname, setOwnerNickname] = useState(''); // 방장 이름을 상태로 관리
    const [isOwner, setIsOwner] = useState(false); // 방장 여부 상태 추가
    const [roomName, setRoomName] = useState(location.state?.roomName || '기본 방 이름');
    const [maxCount, setMaxCount] = useState(10); // 초기 최대 인원 설정
    const [password, setPassword] = useState(''); // 초기 비밀번호 설정
    const [isPrivate, setIsPrivate] = useState(false); // 초기 비공개 여부 설정

    const currentUserName = location.state?.nickName;

    useEffect(() => {
        // 방장 여부 설정을 위해 ownerNickname과 currentUserName을 비교
        setIsOwner(currentUserName === ownerNickname);
    }, [currentUserName, ownerNickname]);

    // 자식 컴포넌트로부터 ownerNickname을 업데이트하는 함수
    const handleOwnerNicknameUpdate = (ownerNicknameFromChild) => {
        console.log(ownerNicknameFromChild);
        setOwnerNickname(ownerNicknameFromChild);
    
    };

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
                    onOwnerNicknameUpdate={handleOwnerNicknameUpdate} // 콜백 함수 전달
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
