import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import '../../CSS/ChatListPage.css';
import '../../CSS/FilteredRoom.css';
import RoomModal from './RoomModal';
import PasswordModal from './PasswordModal';

export default function ChatListPage() {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const SERVER_URL = 'http://43.203.141.146:5000';

    // 서버에서 방 목록을 가져오는 함수
    const fetchRooms = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/rooms`);
            const data = await response.json();
            console.log("response:", response);
            console.log("data:" ,data);
            setRooms(data);
            setFilteredRooms(data.filter(room => !room.isPrivate));
        } catch (error) {
            console.error('Failed to fetch rooms:', error);
        }
    };

    // 컴포넌트가 로드될 때 방 목록을 불러오기
    useEffect(() => {
        fetchRooms();  // 최초 방 목록 불러오기
    }, []);

    // 방 선택 핸들러
    function handleSelectRoom(room) {
        room.isPrivate ? openPasswordModal(room) : navigateToRoom(room);
    }

    // 비밀번호 모달 열기
    function openPasswordModal(room) {
        setSelectedRoom(room);
        setIsPasswordModalOpen(true);
    }

    // 방으로 이동
    function navigateToRoom(room) {
        if (room.count < room.maxCount) {
            navigate(`/chatPage/${room.name}`, {
                state: { roomName: room.name, nickName: location.state?.nickName }
            });
        } else {
            alert('방이 꽉 찼습니다.');
        }
    }

    // 비밀번호 제출 처리
    const handlePasswordSubmit = async (enteredPassword) => {
        if (selectedRoom?.password === enteredPassword) {
            setIsPasswordModalOpen(false);
            navigateToRoom(selectedRoom);
        } else {
            alert('비밀번호가 틀렸습니다.');
        }
    };

    // 새로운 방 추가 처리
    const handleAddRoom = async (newRoom) => {
        const room = {
            id : '',
            name: newRoom.name,
            count: newRoom.count,
            maxCount: newRoom.maxCount,
            password: newRoom.password || '', // 비밀번호가 없으면 빈 문자열로 설정
            isPrivate: newRoom.isPrivate,
            ownerId: '', // 서버에서는 ownerID가 필요하지만, 클라이언트에서는 제공하지 않음
            nickName: newRoom.ownerNickname // 서버의 'ownerNickname'과 일치
        };

        console.log("room:", room); 
        try {
            const response = await fetch(`${SERVER_URL}/add_room`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(room)
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
            }

            setRooms(prevRooms => [...prevRooms, room]);
            if (!room.isPrivate || searchQuery && room.name.toLowerCase().includes(searchQuery)) {
                setFilteredRooms(prevRooms => [...prevRooms, room]);
            }

            return true;
        } catch (error) {
            console.error('Failed to add room', error);
            alert('방 생성에 실패했습니다.');
            return false;
        }
    };

    // 검색어 입력 처리
    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredRooms(rooms.filter(room =>
            (!room.isPrivate && room.name.toLowerCase().includes(query)) ||
            (room.isPrivate && room.name.toLowerCase() === query)
        ));
    };

    // 채팅방 목록을 새로 불러오는 핸들러
    const handleRefreshRooms = () => {
        fetchRooms(); // 서버에서 방 목록을 다시 불러옴
    };

    return (
        <div className="chatListPage">
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
                            key={room.name}
                            onClick={() => handleSelectRoom(room)}
                            className={`room ${room.count >= room.maxCount ? 'full' : ''}`}
                        >
                            <h3>{room.name}</h3>
                            <p>{room.isPrivate && <span className="lock-icon">🔒</span>} {room.count}/{room.maxCount}, {room.count}명 접속중</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="add-room-section">
                {/* 새로고침 버튼 추가 */}
                <button onClick={handleRefreshRooms} className="refresh-button">
                        새로고침
                </button>
                <button onClick={() => setIsModalOpen(true)}>방 만들기</button>
            </div>

            {isModalOpen && (
                <RoomModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddRoom}
                />
            )}

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
