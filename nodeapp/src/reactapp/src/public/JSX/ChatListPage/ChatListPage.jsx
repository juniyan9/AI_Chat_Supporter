import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import '../../CSS/ChatListPage.css'

export default function ChatListPage() {

    const [rooms, setRooms] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    // 사용자 닉네임 확인
    console.log(location.state?.nickName);

    // 미리 방을 설정
    // useEffect(() => {
    //     setRooms([
    //         { id: 1, name: '채팅방 이름 1', count: 0, maxCount: 3 },
    //         { id: 2, name: '채팅방 이름 2', count: 0, maxCount: 3 },
    //         { id: 3, name: '채팅방 이름 3', count: 0, maxCount: 3 },
    //         { id: 4, name: '채팅방 이름 4', count: 0, maxCount: 3 },
    //         { id: 5, name: '채팅방 이름 5', count: 0, maxCount: 3 },
    //         { id: 6, name: '채팅방 이름 6', count: 0, maxCount: 3 },
    //     ]);
    // }, []);

    useEffect(() => {
        async function fetchRooms() {
            fetch('http://192.168.0.113:5000/chatList', {
                method: "GET",
        })
            .then((response) => response.json())
            .then((data) => 
            setRooms(data)
            )
        }
        fetchRooms();

    }, []);

    // 방을 클릭하면 채팅 페이지로 이동
    function handleSelectRoom(room) {
        if (room.count < room.maxCount) {
            navigate(`/chatPage/${room.name}`, {
                state: { 'roomName': room.name, 'nickName': location.state?.nickName }
            });
        } else {
            alert('방이 꽉 찼습니다..');
        }
    }

    // 방 추가 기능
    const handleAddRoom = () => {
        const newRoomId = rooms.length + 1;
        const newRoom = {
            id: newRoomId,
            name: `채팅방 이름 ${newRoomId}`,
            count: 0,
            maxCount: 3,  // 여기서 최대 인원을 설정할 수 있습니다.
        };
        setRooms((prevRooms) => [...prevRooms, newRoom]);
    }

    return (
        <div className="chatListPage">
            <h2>채팅방 목록</h2>
            {rooms.map((room) => (
                <div 
                    key={room.id} 
                    onClick={() => handleSelectRoom(room)} 
                    className={`room ${room.count >= room.maxCount ? 'full' : ''}`}
                >
                    <h3>{room.name}</h3>
                    <p>{room.count}/{room.maxCount}, {room.count}명 접속중</p>
                </div>
            ))}
            
            {/* 방 추가 버튼 */}
            <div className="add-room-section">
                <button onClick={handleAddRoom}>방 추가</button>
            </div>
        </div>
    );
}



// import React, { useEffect, useState } from "react"
// import { useNavigate, useLocation } from 'react-router-dom';
// import '../../CSS/ChatListPage.css';


// export default function ChatListPage() {

//     const [rooms, setRooms] = useState([]);

//     const location = useLocation();
//     const navigate = useNavigate();

//     console.log(location.state.nickName);

//     useEffect(() => {
//         async function fetchRooms() {
//             fetch('http://192.168.0.113:5000/chatList', {
//                 method: "GET",
//             })
//             .then((response) => response.json())
//             .then((data) => 
//                     setRooms(data)
//                 )
//         }
//         fetchRooms();

//     }, []);

//     const handleAddRoom = () => {

//         setRooms((prevRooms) => [...prevRooms, { id : 3,
//             name: 'room3',  
//             count: 3,
//             maxCount: 6,}]);
//     }

//     function handleSelectRoom (room){

//         console.log('handleSelectRoom >> come');
//         navigate(`/chatPage/${room.name}`, {state:{'roomName':room.name, 'nickName' : location.state.nickName }});
//     }
    
//     return (
//         <div className="ChatListPage">
//             <button onClick={handleAddRoom}>방 추가</button>
                        
//             {rooms.map((room) => (
//                 <div key={room.id} onClick={()=>handleSelectRoom(room)}>
//                     <h3>id: {room.id}, Room name:{room.name} </h3> 
//                     <h5  key={room} >{room.count}/{room.maxCount}</h5>
//                 </div>
//             ))}
//         </div>
//     )
// }