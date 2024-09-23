import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import '../../CSS/ChatListPage.css';
import '../../CSS/FilteredRoom.css';
import RoomModal from './RoomModal';

export default function ChatListPage() {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const SERVER_URL = 'http://43.203.141.146:5000';

    // 서버에서 방 목록을 가져오는 함수
    const fetchRooms = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/rooms`, {
                credentials : 'include',
                nickName : location.state?.nickName
            });
            const data = await response.json();
            console.log("서버의 응답 데이터:", response);
            console.log("서버의 data:" ,data);
            console.log("닉네임", location.state?.nickName);
            setRooms(data);
            setFilteredRooms(data); // 모든 방을 필터링 없이 설정
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
        navigateToRoom(room);
    }

    // 방으로 이동
    function navigateToRoom(room) {
        if (room.count < room.maxCount) {
            navigate(`/chatPage/${room.id}`, {
                state: { roomId: room.id,
                         nickName: location.state?.nickName,
                         // state를 룸아이와 닉네임만 가지고 방으로 이동하면 유저들에겐 방설정이 바껴도 타격이 없지않을까?
                         roomName: room.name,
                        //  maxCount: room.maxCount,
                        //  isPrivate: room.isPrivate,
                        //  password: room.password 
                        } // 비밀번호도 전달
            });
            console.log("방 id:", room.id);
        } else {
            alert('방이 꽉 찼습니다.');
        }
    }

    // 새로운 방 추가 처리
    const handleAddRoom = async (newRoom) => {
        const room = {
            name: newRoom.name,
            count: newRoom.count,
            maxCount: newRoom.maxCount,
            password: newRoom.password || '', // 비밀번호가 없으면 빈 문자열로 설정
            isPrivate: newRoom.isPrivate,
            // 서버에서는 ownerID가 필요하지만, 클라이언트에서는 제공하지 않음
            nickName: newRoom.ownerNickname // 서버의 'ownerNickname'과 일치
        };


        try {
            const response = await fetch(`${SERVER_URL}/add_room`, {
                credentials : 'include',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(room)
            });

            const data = await response.json();
            console.log("서버의 data:" ,data);

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
            }

            setRooms(prevRooms => [...prevRooms, data]);
            setFilteredRooms(prevRooms => [...prevRooms, data]); // 모든 방을 필터링 없이 설정

            return true;
        } catch (error) {
            console.error('Failed to add data', error);
            alert('방 생성에 실패했습니다.');
            return false;
        }
    };

    // 검색어 입력 처리
    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredRooms(rooms.filter(room =>
            room.name.toLowerCase().includes(query)
        ));
        // console.log(rooms);
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
                        onChange={handleSearchChange} // 검색어 치면 그때 한번 딱 렌더링 해주는 기능으로 개선 해보자. 지금은 효율이 떨어진다.
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
                            <p>
                                <span className="people-icon">👥</span>
                                {room.isPrivate && <span className="lock-icon">🔒</span>} 
                                {room.count}/{room.maxCount}, {room.count}명 접속중
                            </p>
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
        </div>
    );
}
