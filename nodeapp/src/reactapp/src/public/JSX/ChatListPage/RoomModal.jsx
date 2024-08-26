import React, { useState } from "react";
import '../../CSS/RoomModal.css';

function RoomModal({ isOpen, onClose, onSave }) {
    const [roomName, setRoomName] = useState('');
    const [password, setPassword] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [maxCount, setMaxCount] = useState(1); // 초기 값 1

    const handleSave = () => {
        if (roomName.length < 2) {
            alert("방 제목은 2자 이상이어야 한다.");
            return;
        }
        onSave({ roomName, password, isPrivate, maxCount });
        onClose();
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
                    최대 인원수: <span>{maxCount}</span> {/* 선택된 값 표시 */}
                    <input 
                        type="range" 
                        value={maxCount} 
                        onChange={(e) => setMaxCount(parseInt(e.target.value))} 
                        min="1" 
                        max="10"  // 최대 인원을 10으로 설정 (필요에 따라 조정 가능)
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
