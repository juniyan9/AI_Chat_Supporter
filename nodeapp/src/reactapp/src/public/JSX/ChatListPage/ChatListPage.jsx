import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import '../../CSS/ChatListPage.css';
import '../../CSS/FilteredRoom.css';
import RoomModal from './RoomModal'; // 방 생성 모달 컴포넌트
import PasswordModal from './PasswordModal'; // 비밀번호 입력 모달 컴포넌트

export default function ChatListPage() {
    const [rooms, setRooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // 방 생성 모달 상태
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // 비밀번호 모달 상태
    const [selectedRoom, setSelectedRoom] = useState(null); // 선택된 방 정보
    const [filteredRooms, setFilteredRoom] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
    const location = useLocation();
    const navigate = useNavigate();
    const SERVER_URL = 'http://192.168.0.154:5050'; // 서버 URL 하드코딩

    useEffect(() => {
        async function fetchRooms() {
            try {
                const response = await fetch(`${SERVER_URL}/chatList`, {
                    method: "GET",
                });
                const data = await response.json();
                setRooms(data);
                setFilteredRoom(data); // 필터링된 방 상태 초기화
            } catch (error) {
                console.error('Failed to fetch rooms:', error);
            }
        }
        fetchRooms();
    }, []);

    // 방을 클릭하면 비공개 방이면 비밀번호 입력 모달을, 아니면 채팅 페이지로 이동
    function handleSelectRoom(room) {
        if (room.isPrivate) {
            setSelectedRoom(room);
            setIsPasswordModalOpen(true);
        } else {
            navigateToRoom(room);
        }
    }

    // 방으로 이동하는 함수
    function navigateToRoom(room) {
        if (room.count < room.maxCount) {
            navigate(`/chatPage/${room.name}`, {
                state: { 'roomName': room.name, 'nickName': location.state?.nickName }
            });
        } else {
            alert('방이 꽉 찼습니다.');
        }
    }

    // 비밀번호를 확인하고 방으로 이동
    const handlePasswordSubmit = async (enteredPassword) => {
        if (selectedRoom.password === enteredPassword) {
            setIsPasswordModalOpen(false);
            navigateToRoom(selectedRoom);
        } else {
            alert('비밀번호가 틀렸습니다.');
        }
    };

    // 방 추가 기능
    const handleAddRoom = async (newRoom) => {
        const newRoomId = rooms.length + 1;
        const room = {
            id: newRoomId, /* 방 아이디 */
            name: newRoom.roomName, /* 방 이름 */
            count: 1, /* 방 생성 시 현재 인원 상태 */
            maxCount: newRoom.maxCount, /* 입장 가능한 최대 인원 수 */
            password: newRoom.password, /* 비밀번호 */
            isPrivate: newRoom.isPrivate, /* 비공개 여부 */
        };
        setRooms((prevRooms) => [...prevRooms, room]);
        setFilteredRoom((prevRooms) => [...prevRooms, room]);

        try {
            // 서버에 새 방 정보를 전송
            const response = await fetch(`${SERVER_URL}/addRoom`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(room),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // 방 추가 후 해당 방으로 이동
            navigate(`/chatPage/${room.name}`, {
                state: { 'roomName': room.name, 'nickName': location.state?.nickName }
            });
        } catch (error) {
            console.error('Failed to add room', error);
        }
    };

    // 검색어에 따라 방 목록 필터링
    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        
        if (query ==='') {
            setFilteredRoom(rooms);
        }else {
            setFilteredRoom(rooms.filter(room => room.name.toLowerCase() === (query)));
        }
    };

    return (
        <div className="chatListPage">
            {/* 채팅방 목록 */}
            <div className="room-list-section">
                <h2>채팅방 목록</h2>
                <div className="search-section">
                    <input
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="방 제목 검색"
                        className="search-input"
                    />
                </div>
                <div className="room-list">
                    {filteredRooms.map((room) => (
                        <div 
                            key={room.id} 
                            onClick={() => handleSelectRoom(room)} 
                            className={`room ${room.count >= room.maxCount ? 'full' : ''}`}
                        >
                            <h3>{room.name}</h3>
                            <p>{room.count}/{room.maxCount}, {room.count}명 접속중</p>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* 방 추가 버튼 */}
            <div className="add-room-section">
                <button onClick={() => setIsModalOpen(true)}>방 만들기</button>
            </div>

            {/* 방 설정 모달 */}
            {isModalOpen && (
                <RoomModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddRoom}
                />
            )}

            {/* 비밀번호 입력 모달 */}
            {isPasswordModalOpen && (
                <PasswordModal
                    isOpen={isPasswordModalOpen}
                    onClose={() => setIsPasswordModalOpen(false)}
                    onSubmit={handlePasswordSubmit}
                />
            )}
        </div>
    );
}
