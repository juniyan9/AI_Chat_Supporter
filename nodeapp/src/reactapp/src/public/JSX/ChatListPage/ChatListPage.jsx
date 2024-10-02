import React, { useEffect, useState } from "react";
import '../../CSS/ChatListPage.css';
import '../../CSS/FilteredRoom.css';
import RoomModal from './RoomModal';
import { useNavigate} from 'react-router-dom';

export default function ChatListPage({setIsSocketConnected,isSocketConnected,onSelectedRoom, UserName, roomName, setRoomName, password, setPassword, isPrivate, setIsPrivate, maxCount, setMaxCount}) {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [timeoutId, setTimeoutId] = useState(0);
    
    const navigate = useNavigate();

    console.log('listpage16',roomName);
    
    const SERVER_URL = 'http://localhost:5000';
    // console.log('rooms1',rooms);
    //rooms : 현재 존재하는 방배열 및 정보 conut,id,private,roomname,ownerid,ownernickname,password 등
    const handleSelectedRoom = (room) => {
        //console.log('chatlistpage룸',room);//conut,id,private,maxcount,name(roomname),ownerid,ownernickname,password
        onSelectedRoom(room);
        setTimeoutId(null);
        if(isSocketConnected){
            setIsSocketConnected(false);
        }
        fetchRooms();
    }

    // 서버에서 방 목록을 가져오는 함수
    const fetchRooms = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/rooms`, {
                credentials : 'include',
                nickName : UserName
            });
            const data = await response.json();
            setRooms(data.rooms);
            setFilteredRooms(data.rooms); // 모든 방을 필터링 없이 설정
            //console.log("서버의 응답 데이터:", response); // 
            //console.log("서버의 data:" ,data); // rooms,timeoutmin
            //console.log("닉네임", UserName); //유저 닉네임
            // console.log("data.rooms", data.rooms); //rooms랑 같음
            
            if (data.timeoutmin) {
                console.log("timeout 생성됩니다.");
                setTimeoutId(setTimeout(() => {
                    console.log("timeout 됐습니다.")
                    setTimeoutId(0);
                    // navigate('/');
                }, data.timeoutmin));
            }

        } catch (error) {
            console.error('Failed to fetch rooms:', error);
        }
    };

    // 컴포넌트가 로드될 때 방 목록을 불러오기
    useEffect(() => {
        fetchRooms();  // 방 목록 불러오기
    }, []);




    // 새로운 방 추가 처리
    const handleAddRoom = async (newRoom) => {
        const room = {
            name: newRoom.name,
            count: newRoom.count,
            maxCount: newRoom.maxCount,
            password: newRoom.password || '',
            isPrivate: newRoom.isPrivate,
            nickName: newRoom.ownerNickname
        };
        
        console.log('새로운방방만들기',room);// 새로운 방 데이터 넘겨주는데 닉네임을 넘겨주기
        console.log('새로운방만들기2',newRoom); // 새로운 방데이터 넘겨주는데 ownernickname추가

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
                    <button onClick={handleRefreshRooms} className="refresh-button">
                        새로고침
                    </button>   
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
                            onClick={() => handleSelectedRoom(room)}
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
                <button onClick={() => setIsModalOpen(true)}>방 만들기</button>
            </div>

            {isModalOpen && (
                <RoomModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddRoom}
                    fetchRooms={fetchRooms}
                    roomName={roomName}
                    setRoomName={setRoomName}
                    password={password}
                    setPassword={setPassword}
                    isPrivate={isPrivate}
                    setIsPrivate={setIsPrivate}
                    maxCount={maxCount}
                    setMaxCount={setMaxCount}
                    UserName={UserName}
                    timeoutId={timeoutId}
                />
            )}
        </div>
    );
}
