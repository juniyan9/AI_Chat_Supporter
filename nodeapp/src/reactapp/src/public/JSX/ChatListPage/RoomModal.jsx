import React, { useState } from "react";
import '../../CSS/RoomModal.css';
import { useNavigate, useLocation } from "react-router-dom";

function RoomModal({ isOpen, onClose, onSave }) {
    const [roomName, setRoomName] = useState('');
    const [password, setPassword] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [maxCount, setMaxCount] = useState(1); // 초기 값 1
    const navigate = useNavigate(); // useNavigate 훅 사용
    const location = useLocation(); // useLocation 훅 사용
    const SERVER_URL = 'http://192.168.0.154:5050'; // 서버 URL

    const handleSave = async () => {
        if (roomName.length < 2) {
            alert("방 제목은 2자 이상이어야 한다.");
            return;
        }
        if (maxCount < 1 || maxCount > 10) {
            alert("최대 인원수는 1에서 10 사이여야 합니다.");
            return;
        }

        const room = {
            name: roomName, // 방 이름
            count: 0,      // 방 생성 시 현재 인원 상태
            maxCount,      // 최대 인원 수
            password: password || '', // 비밀번호 (선택적)
            isPrivate,     // 비공개 여부
            ownerID: location.state?.nickName // 방을 만든 유저 정보
        };

        console.log('Creating room:', room); // 방이 만들어졌는지 확인 

        // 클라이언트의 상태를 업데이트
        onSave(room); // 부모 컴포넌트에 방 생성 정보 전달

        try {
            // 서버에 새 방 정보를 전송
            const response = await fetch(`${SERVER_URL}/add-room`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(room),
            });

            if (!response.ok) {
                const errorMessage = await response.text(); // 오류 메시지 읽기
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
            }

            // 방 생성 후 알림
            alert('방이 성공적으로 생성되었습니다.');

            // 방 생성 후 채팅방 페이지로 이동
            navigate(`/chatPage/${roomName}`, {
                state: { roomName, nickName: location.state?.nickName }
            });

            onClose(); // 모달 닫기
        } catch (error) {
            console.error('Failed to add room', error);
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
