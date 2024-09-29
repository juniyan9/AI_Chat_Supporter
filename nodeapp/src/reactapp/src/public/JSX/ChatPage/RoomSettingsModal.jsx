import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../CSS/RoomSettingsModal.css';



const SERVER_URL = 'http://43.203.141.146:9000';

export default function RoomSettingsModal({ isOpen, onClose, roomDetails, onUpdate, onDelete, socket, isSocketConnected}) {
    const [roomName, setRoomName] = useState(roomDetails?.name || '');
    const [maxCount, setMaxCount] = useState(roomDetails?.maxCount || 10);
    const [password, setPassword] = useState(roomDetails?.password || '');
    const [isPrivate, setIsPrivate] = useState(roomDetails?.isPrivate || false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [count, setCount] = useState(roomDetails?.count || 0);

    // const location = useLocation(); // 훅을 호출해 현재 경로와 관련된 상태 정보를 얻습니다.
    const navigate = useNavigate();

    useEffect(() => {
        if (roomDetails) {
            setRoomName(roomDetails.name);
            setMaxCount(roomDetails.maxCount);
            setPassword(roomDetails.password);
            setIsPrivate(roomDetails.isPrivate);
            setCount(roomDetails.count);
            // 필요하다면 이 부분에서 ownerNickname을 로그로 찍어 확인
        }
    }, [roomDetails]);

    console.log("roomDetails:" , roomDetails.ownerNickname);
    console.log(roomDetails);

    const handleSave = async () => {
        // console.log(roomDetails.ownerNickname);
        
        if (roomName.trim() === '') {
            alert('방 이름을 입력하세요.');
            return;
        }
        if (maxCount < 2 || maxCount > 10) {
            alert('최대 인원수는 2에서 10 사이여야 합니다.');
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch(`${SERVER_URL}/update_room`, {
                
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    originalName: roomDetails.name,
                    updatedName: roomName,
                    ownerNickname : roomDetails.ownerNickname,
                    updatedMaxCount: maxCount,
                    updatedPassword: password,
                    updatedIsPrivate: isPrivate,
                    count : count, // 현재 인원 수 포함
                }),
            
            });
            const data = await response.json();
            console.log("서버에게 받은 업데이트 된 방 정보 :", data.data);

            
            if (response.ok) {
                setIsSaving(false);
                alert('방 정보가 업데이트되었습니다.');

                onUpdate({ 
                    name: roomName,
                    maxCount, 
                    password, 
                    isPrivate,
                    count : data.data.count, // 여기서 받은 count를 포함
                    ownerNickname : roomDetails.ownerNickname, //소유자 닉네임
                    id : data.data.id,
                    
                });
                onClose();
            
            } else {
                const errorData = await response.json();
                alert('방 정보 업데이트에 실패했습니다.');
                console.error('Failed to update room:', errorData.error);
                setIsSaving(false);
            }
        } catch (error) {
            setIsSaving(false);
            alert('서버와의 통신 중 오류가 발생했습니다.');
            console.error('Failed to update room:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("정말로 방을 삭제하시겠습니까?")) {
            setIsDeleting(true);

            console.log("roomName", roomName)

           

            socket.current.emit('delete_room',roomName)

                       // 삭제 요청 후 바로 ChatListPage로 이동
                    navigate('/ChatListPage', {
                        state: {
                            nickName: roomDetails.nickName,  // 삭제 후 닉네임 정보 전달
                        },
                    });
            
                    setIsDeleting(false);  // 삭제 상태 리셋
        }
    };

    return (
        isOpen && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>방 설정</h2>
                    <label>
                        방 이름:
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            disabled={isSaving || isDeleting}
                        />
                    </label>
                    <label>
                        최대 인원: {maxCount}
                        <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={maxCount}
                            onChange={(e) => setMaxCount(Number(e.target.value))}
                            className="slider"
                            disabled={isSaving || isDeleting}
                        />
                    </label>
                    <label>
                        비밀번호:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isSaving || isDeleting}
                        />
                    </label>
                    <label>
                        비공개:
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                            disabled={isSaving || isDeleting}
                        />
                    </label>
                    <div className="modal-buttons">
                        <button onClick={handleSave} disabled={isSaving || isDeleting}>
                            {isSaving ? '저장 중...' : '저장'}
                        </button>
                        <button onClick={onClose} disabled={isSaving || isDeleting}>닫기</button>
                        <button onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? '삭제 중...' : '방 삭제'}
                        </button>
                    </div>
                </div>
            </div>
        )
    );
}
