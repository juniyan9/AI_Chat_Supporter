import React, { useState } from "react";
import '../../CSS/RoomModal.css';
import { useNavigate, useLocation } from "react-router-dom";

function RoomModal({ isOpen, onClose, onSave }) { // 부모 컴포넌트에서 전달받는 props이다.
    const [roomName, setRoomName] = useState('');
    const [password, setPassword] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [maxCount, setMaxCount] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSave = async () => {
        if (roomName.length < 2) {
            alert("방 제목은 2자 이상이어야 합니다.");
        }
        if (maxCount < 1 || maxCount > 10) {
            alert("최대 인원수는 1에서 10 사이여야 합니다.");
        }

        const newRoom = { 
            roomName,
            password,
            isPrivate,
            maxCount,
            nickName: location.state?.nickName
        };

        console.log("newRoom:" ,newRoom);
        try {
            const success = await onSave(newRoom);

            if (success) {
                navigate(`/chatPage/${roomName}`, {
                    state: { roomName, nickName: location.state?.nickName }
                });
                onClose();
            }
        } catch (error) {
            console.error('Failed to create room', error);
            alert('방 생성에 실패했습니다.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>방 설정</h2>
                <label>
                    방 제목:
                    <input 
                        type="text" 
                        value={roomName} 
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="방 제목을 입력하세요"
                    />
                </label>
                <label>
                    비밀번호:
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        disabled={!isPrivate}
                        placeholder="비밀번호를 입력하세요"
                    />
                </label>
                <label>
                    공개 여부:
                    <input 
                        type="checkbox" 
                        checked={isPrivate} 
                        onChange={() => setIsPrivate(!isPrivate)} 
                    />
                    비공개
                </label>
                <label>
                    최대 인원수: <span>{maxCount}</span>
                    <input 
                        type="range" 
                        value={maxCount}       
                        onChange={(e) => setMaxCount(parseInt(e.target.value))} 
                        min="1" 
                        max="10"
                        step="1" 
                    />
                </label>
                <button onClick={handleSave}>만들기</button>
                <button onClick={onClose}>취소</button>
            </div>
        </div>
    );
}

export default RoomModal;
