import React, { useEffect, useState } from "react";
import '../../CSS/ChatListFrame.css';
import '../../CSS/FilteredRoom.css';
import RoomModal from './RoomModal';
import { useNavigate} from 'react-router-dom';

// export default function ChatListFrame({setIsSocketConnected,isSocketConnected,onSelectedRoom, UserName, roomName, setRoomName, password, setPassword, isPrivate, setIsPrivate, maxCount, setMaxCount,timeoutId,setTimeoutId,count,setCount,setOwnerNickName}) {
//     const [rooms, setRooms] = useState([]);
//     const [filteredRooms, setFilteredRooms] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(false);
    
//     const navigate = useNavigate();

//     console.log('listpage16',roomName);
    
//     const SERVER_URL = 'http://43.203.141.146:5000';
//     // console.log('rooms1',rooms);
//     //rooms : 현재 존재하는 방배열 및 정보 conut,id,private,roomname,ownerid,ownernickname,password 등
//     const handleSelectedRoom = (room) => {
//         //console.log('ChatListFrame룸',room);//conut,id,private,maxcount,name(roomname),ownerid,ownernickname,password
//         onSelectedRoom(room);
//         setMaxCount(room.maxCount)
//         setCount(room.count);
//         setOwnerNickName(room.ownerNickname)
//         if(!isSocketConnected){
//             setIsSocketConnected(true);
//         }
//         fetchRooms();
//     }

//     // 서버에서 방 목록을 가져오는 함수
//     const fetchRooms = async () => {
//         try {
//             const response = await fetch(`${SERVER_URL}/rooms`, {
//                 credentials : 'include',
//                 nickName : UserName
//             });
//             const data = await response.json();
//             setRooms(data.rooms);
//             setFilteredRooms(data.rooms); // 모든 방을 필터링 없이 설정
//             //console.log("서버의 응답 데이터:", response); // 
//             //console.log("서버의 data:" ,data); // rooms,timeoutmin
//             //console.log("닉네임", UserName); //유저 닉네임
//             // console.log("data.rooms", data.rooms); //rooms랑 같음
            
//             if (data.timeoutmin) {
//                 console.log("timeout 생성됩니다.");
//                 setTimeoutId(setTimeout(() => {
//                     console.log("timeout 됐습니다.")
//                     setTimeoutId(0);
//                     // navigate('/');
//                 }, data.timeoutmin));
//             }

//         } catch (error) {
//             console.error('Failed to fetch rooms:', error);
//         }
//     };

//     // 컴포넌트가 로드될 때 방 목록을 불러오기
//     useEffect(() => {
//         fetchRooms();  // 방 목록 불러오기
//     }, []);




//     // 새로운 방 추가 처리
//     const handleAddRoom = async (newRoom) => {
//         const room = {
//             name: newRoom.name,
//             count: newRoom.count,
//             maxCount: newRoom.maxCount,
//             password: newRoom.password || '',
//             isPrivate: newRoom.isPrivate,
//             nickName: newRoom.ownerNickname
//         };
        
//         console.log('새로운방방만들기',room);// 새로운 방 데이터 넘겨주는데 닉네임을 넘겨주기
//         console.log('새로운방만들기2',newRoom); // 새로운 방데이터 넘겨주는데 ownernickname추가

//         try {
//             const response = await fetch(`${SERVER_URL}/add_room`, {
//                 credentials : 'include',
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(room)
//             });

//             const data = await response.json();
//             console.log("서버의 data:" ,data);

//             if (!response.ok) {
//                 const errorMessage = await response.text();
//                 throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
//             }

//             setRooms(prevRooms => [...prevRooms, data]);
//             setFilteredRooms(prevRooms => [...prevRooms, data]); // 모든 방을 필터링 없이 설정

//             // 새로운 방을 추가한 후 handleSelectedRoom 호출
//             handleSelectedRoom(room);

//             console.log("handleSelectedRoom(data):", room)

//             return true;
//         } catch (error) {
//             console.error('Failed to add data', error);
//             alert('방 생성에 실패했습니다.');
//             return false;
//         }
//     };

//     // 검색어 입력 처리
//     const handleSearchChange = (e) => {
//         const query = e.target.value.toLowerCase();
//         setSearchQuery(query);
//         setFilteredRooms(rooms.filter(room =>
//             room.name.toLowerCase().includes(query)
//         ));
//     };

//     // 채팅방 목록을 새로 불러오는 핸들러
//     const handleRefreshRooms = () => {
//         fetchRooms(); // 서버에서 방 목록을 다시 불러옴
//         console.log("서버에서 받은 방 목록", rooms)
//     };

//     return (
//         <div className="ChatListFrame">
//             <div className="room-list-section">
//                 <div className="search-section">
//                     <button onClick={handleRefreshRooms} className="refresh-button">
//                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.06957 10.8763C3.62331 6.43564 7.40967 3 12 3C14.2824 3 16.4028 3.85067 18.0118 5.25439V4C18.0118 3.44772 18.4595 3 19.0118 3C19.5641 3 20.0118 3.44772 20.0118 4V8C20.0118 8.55228 19.5641 9 19.0118 9H15C14.4477 9 14 8.55228 14 8C14 7.44772 14.4477 7 15 7H16.9571C15.6757 5.76379 13.9101 5 12 5C8.43108 5 5.48466 7.67174 5.0542 11.1237C4.98586 11.6718 4.48619 12.0607 3.93815 11.9923C3.39011 11.924 3.00123 11.4243 3.06957 10.8763ZM20.0618 12.0077C20.6099 12.076 20.9988 12.5757 20.9304 13.1237C20.3767 17.5644 16.5903 21 12 21C9.72322 21 7.60762 20.1535 5.99999 18.7559V20C5.99999 20.5523 5.55228 21 4.99999 21C4.44771 21 3.99999 20.5523 3.99999 20V16C3.99999 15.4477 4.44771 15 4.99999 15H8.99999C9.55228 15 9.99999 15.4477 9.99999 16C9.99999 16.5523 9.55228 17 8.99999 17H7.04285C8.32433 18.2362 10.0899 19 12 19C15.5689 19 18.5153 16.3283 18.9458 12.8763C19.0141 12.3282 19.5138 11.9393 20.0618 12.0077Z" fill="currentColor"></path></svg>
//                     </button>   
//                     <input
//                         value={searchQuery}
//                         onChange={handleSearchChange}
//                         placeholder="방 제목 검색"
//                         className="search-input"
//                     />
//                 </div>
//                 <div className="room-list">
//                     {filteredRooms.map((room) => (
//                         <div
//                             key={room.name}
//                             onClick={() => handleSelectedRoom(room)}
//                             className={`room ${room.count >= room.maxCount ? 'full' : ''}`}
//                         >
//                             <h3>{room.name}</h3>
//                             <p>
//                                 <span className="people-icon">👥</span>
//                                 {room.isPrivate && <span className="lock-icon">🔒</span>} 
//                                 {count}/{maxCount}, {count}명 접속중
//                             </p>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <div className="add-room-section">
//                 <button onClick={() => setIsModalOpen(true)}>방 만들기</button>
//             </div>

//             {isModalOpen && (
//                 <RoomModal
//                     isOpen={isModalOpen}
//                     onClose={() => setIsModalOpen(false)}
//                     onSave={handleAddRoom}
//                     fetchRooms={fetchRooms}
//                     roomName={roomName}
//                     setRoomName={setRoomName}
//                     password={password}
//                     setPassword={setPassword}
//                     isPrivate={isPrivate}
//                     setIsPrivate={setIsPrivate}
//                     maxCount={maxCount}
//                     setMaxCount={setMaxCount}
//                     UserName={UserName}
//                     timeoutId={timeoutId}
//                 />
//             )}
//         </div>
//     );
// }

export default function ChatListFrame({setIsSocketConnected,isSocketConnected,onSelectedRoom, UserName, roomName, setRoomName, password, setPassword, isPrivate, setIsPrivate, maxCount, setMaxCount,timeoutId,setTimeoutId,count,setCount,setOwnerNickName}) {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const navigate = useNavigate();

    console.log('listpage16',roomName);
    
    const SERVER_URL = 'http://43.203.141.146:5000';
    // console.log('rooms1',rooms);
    //rooms : 현재 존재하는 방배열 및 정보 conut,id,private,roomname,ownerid,ownernickname,password 등
    const handleSelectedRoom = (room) => {
        //console.log('ChatListFrame룸',room);//conut,id,private,maxcount,name(roomname),ownerid,ownernickname,password
        onSelectedRoom(room);
        setRoomName(room.name);
        setMaxCount(room.maxCount);
        setCount(room.count);
        setOwnerNickName(room.ownerNickname);
        if(!isSocketConnected){
            setIsSocketConnected(true);
        }
        fetchRooms();
    }
    

    // 서버에서 방 목록을 가져오는 함수
    // const fetchRooms = async () => {
    //     try {
    //         const response = await fetch(`${SERVER_URL}/rooms`, {
    //             credentials : 'include',
    //             nickName : UserName
    //         });
    //         const data = await response.json();
    //         setRooms(data.rooms);
    //         setFilteredRooms(data.rooms); // 모든 방을 필터링 없이 설정
    //         //console.log("서버의 응답 데이터:", response); // 
    //         //console.log("서버의 data:" ,data); // rooms,timeoutmin
    //         //console.log("닉네임", UserName); //유저 닉네임
    //         // console.log("data.rooms", data.rooms); //rooms랑 같음
            
    //         if (data.timeoutmin) {
    //             console.log("timeout 생성됩니다.");
    //             setTimeoutId(setTimeout(() => {
    //                 console.log("timeout 됐습니다.")
    //                 setTimeoutId(0);
    //                 // navigate('/');
    //             }, data.timeoutmin));
    //         }

    //     } catch (error) {
    //         console.error('Failed to fetch rooms:', error);
    //     }
    // };
    const fetchRooms = async () => {
    try {
        const response = await fetch(`${SERVER_URL}/rooms`, {
            credentials: 'include',
            nickName: UserName,
        });
        const data = await response.json();
        setRooms(data.rooms);
        setFilteredRooms(data.rooms);

        if (data.rooms.length > 0) {
            // 방 목록이 비어있지 않은 경우 첫 번째 방의 정보를 설정
            const firstRoom = data.rooms[0];
            setCount(firstRoom.count);
            setMaxCount(firstRoom.maxCount);
            setRoomName(firstRoom.name);
            setOwnerNickName(firstRoom.ownerNickname);
        }

        if (data.timeoutmin) {
            console.log("timeout 생성됩니다.");
            setTimeoutId(
                setTimeout(() => {
                    console.log("timeout 됐습니다.");
                    setTimeoutId(0);
                }, data.timeoutmin)
            );
        }
    } catch (error) {
        console.error('Failed to fetch rooms:', error);
    }
};


    // 컴포넌트가 로드될 때 방 목록을 불러오기
    useEffect(() => {
        const fetchInitialRooms = async () => {
            await fetchRooms(); // 방 목록 불러오기
            
            if (filteredRooms.length > 0) {
                const firstRoom = filteredRooms[0];
                setCount(firstRoom.count);
                setMaxCount(firstRoom.maxCount);
                setRoomName(firstRoom.name);
                setOwnerNickName(firstRoom.ownerNickname);
            }
        };
        fetchInitialRooms();
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

            // 새로운 방을 추가한 후 handleSelectedRoom 호출
            handleSelectedRoom(room);

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
        <div className="ChatListFrame">
            <div className="room-list-section">
                <div className="search-section">
                    <button onClick={handleRefreshRooms} className="refresh-button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.06957 10.8763C3.62331 6.43564 7.40967 3 12 3C14.2824 3 16.4028 3.85067 18.0118 5.25439V4C18.0118 3.44772 18.4595 3 19.0118 3C19.5641 3 20.0118 3.44772 20.0118 4V8C20.0118 8.55228 19.5641 9 19.0118 9H15C14.4477 9 14 8.55228 14 8C14 7.44772 14.4477 7 15 7H16.9571C15.6757 5.76379 13.9101 5 12 5C8.43108 5 5.48466 7.67174 5.0542 11.1237C4.98586 11.6718 4.48619 12.0607 3.93815 11.9923C3.39011 11.924 3.00123 11.4243 3.06957 10.8763ZM20.0618 12.0077C20.6099 12.076 20.9988 12.5757 20.9304 13.1237C20.3767 17.5644 16.5903 21 12 21C9.72322 21 7.60762 20.1535 5.99999 18.7559V20C5.99999 20.5523 5.55228 21 4.99999 21C4.44771 21 3.99999 20.5523 3.99999 20V16C3.99999 15.4477 4.44771 15 4.99999 15H8.99999C9.55228 15 9.99999 15.4477 9.99999 16C9.99999 16.5523 9.55228 17 8.99999 17H7.04285C8.32433 18.2362 10.0899 19 12 19C15.5689 19 18.5153 16.3283 18.9458 12.8763C19.0141 12.3282 19.5138 11.9393 20.0618 12.0077Z" fill="currentColor"></path></svg>
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
                                {count}/{maxCount}, {count}명 접속중
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