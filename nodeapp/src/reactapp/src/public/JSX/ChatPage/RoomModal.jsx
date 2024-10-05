import React, { useState,useEffect } from "react";
import '../../CSS/RoomModal.css';

export default function RoomModal({UserName, isOpen, onClose, onSave,fetchRooms,roomName,setRoomName,password, setPassword,isPrivate, setIsPrivate, maxCount, setMaxCount}){
    const [existingRooms, setExistingRooms] = useState([]); // 중복확인을 위한 state


    // useEffect를 사용하여 모달이 열릴 때 기존 방 목록을 서버에서 가져옴
    useEffect(() => {
        
        if (isOpen) {
            // 서버에서 방 목록을 가져오는 API 호출
            fetch('http://43.203.141.146:5000/rooms')  // 서버의 API
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Room list 불러오기 실패');
                    }
                    return response.json();
                })
                .then(data => {
                    setExistingRooms(data); // 방 목록 저장
                })
                .catch(error => {
                    console.log('Room list 불러오기 실패', error);
                });
        }
    }, [isOpen]);

    const handleSave = async () => {
        // 공백 제거 후 방 제목 만들기
        const trimmedRoomName = roomName.trim();
    
        // 방 제목이 2자 이상인지 확인
        if (trimmedRoomName.length < 2) {
            alert("방 제목은 2자 이상이어야 합니다.");
            return;
        }
    
        // 중복 방 제목 체크
        // const isDuplicate = existingRooms.some(room => room.name === trimmedRoomName);
        // if (isDuplicate) {
        //     alert("이미 존재하는 방 제목입니다. 다시 입력해주세요.");
        //     return;
        // }
        const isDuplicate = Array.isArray(existingRooms) && existingRooms.some(room => room.name === trimmedRoomName);
        if (isDuplicate) {
        alert("이미 존재하는 방 제목입니다. 다시 입력해주세요.");
        return;
        }
    
        // 새로운 방 정보 생성
        const newRoom = {
            name: trimmedRoomName,
            count: 0,
            maxCount,
            password,
            isPrivate,
            ownerNickname: UserName,
        };
    
        try {
            const success = await onSave(newRoom);
            if (success) {
                onClose();
                fetchRooms();
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
                        min="2" 
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
