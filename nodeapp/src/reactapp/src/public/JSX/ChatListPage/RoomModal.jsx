import React, { useState,useEffect } from "react";
import '../../CSS/RoomModal.css';
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; //서버와 통신을 위한 axios 패키지
// import { response } from "express";

// function RoomModal({ isOpen, onClose, onSave }) { // 부모 컴포넌트에서 전달받는 props이다.
    function RoomModal({ isOpen, onClose, onSave, timeoutId }) { // 부모 컴포넌트에서 전달받는 props이다.

    const [roomName, setRoomName] = useState('');
    const [password, setPassword] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [maxCount, setMaxCount] = useState(2);
    const [existingRooms, setExistingRooms] = useState([]); // 기존 방 목록을 저장할 상태
    // 네 가지 상태 변수를 정의하고 초기값을 설정합니다. 각각 방의 이름, 비밀번호, 방의 공개 여부, 최대 인원수 관리
    const navigate = useNavigate(); // 훅을 호출해 페이지를 이동할 때 사용하는 navigate 함수를 얻음
    const location = useLocation(); // 훅을 호출해 현재 경로와 관련된 상태 정보를 얻습니다.


    // useEffect를 사용하여 모달이 열릴 때 기존 방 목록을 서버에서 가져옴
    useEffect(() => {
        if (isOpen) {
            console.log("RoomModal, 받은 timeoutId:", timeoutId);
            // 서버에서 방 목록을 가져오는 API 호출
            fetch('http://192.168.0.113:5000/rooms')  // 서버의 API 주소로 변경
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Room list 불러오기 실패');
                    }
                    return response.json(); // 응답을 JSON으로 파싱
                })
                .then(data => {
                    setExistingRooms(data); // 방 목록을 상태로 저장
                })
                .catch(error => {
                    console.log('Room list 불러오기 실패', error);
                });
        }
    }, [isOpen]);

    const handleSave = async () => {
        // 공백 제거 후 방 제목 만들기
        const trimmedRoomName = roomName.trim();
    
        // 방 제목이 2자 이상인지 확인 (공백만 있는 경우 포함)
        if (trimmedRoomName.length < 2) {
            alert("방 제목은 공백을 제외하고 2자 이상이어야 합니다.");
            return;
        }
    
        // 최대 인원수 검증
        if (maxCount < 2 || maxCount > 10) {
            alert("최대 인원수는 2에서 10 사이여야 합니다.");
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
            password,
            isPrivate,
            maxCount,
            count: 0, // 현재 인원수 초기값 설정
            ownerNickname: location.state?.nickName,
        };
    
        console.log("newRoom:", newRoom);
        try {
            const success = await onSave(newRoom, timeoutId); // 함수가 성공적으로 완료되면 'success'라는 변수에 그 결과를 저장
    
            if (success) { // 방이 성공적으로 생성되면
                navigate(`/chatPage/${trimmedRoomName}`, {
                    // state: { roomName: trimmedRoomName, nickName: location.state?.nickName }
                    state: { roomName: trimmedRoomName, nickName: location.state?.nickName, timeoutId }

                });
                // console.log("방 만들 때 timeoutId 넘겨줌:", timeoutId)
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
                        value={roomName.replace(/\s+/g,'')} 
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
