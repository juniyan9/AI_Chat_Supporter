import React, { useEffect, useState } from "react"
import { useNavigate, useLocation } from 'react-router-dom';
import '../../CSS/ChatListPage.css';


export default function ChatListPage() {

    const [rooms, setRooms] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    console.log(location.state.nickName);

    useEffect(() => {
        
        fetch('http://192.168.0.108:5000/chatList', {
            method: "GET",
        })
        .then((response) => response.json())
        .then((data) => 
                setRooms(data)
        )
        
    }, []);

    const handleAddRoom = () => {

        setRooms((prevRooms) => [...prevRooms, { id : 3,
            name: 'room3',  
            count: 3,
            maxCount: 6,}]);
    }

    function handleSelectRoom (room){

        console.log('handleSelectRoom >> come');
        navigate(`/chatPage/${room.name}`, {state:{'roomName':room.name, 'nickName' : location.state.nickName }});
    }
    
    return (
        <div className="ChatListPage">
            <button onClick={handleAddRoom}>방 추가</button>
                        
            {rooms.map((room) => (
                <div key={room.id} onClick={()=>handleSelectRoom(room)}>
                    <h3>id: {room.id}, Room name:{room.name} </h3> 
                    <h5  key={room} >{room.count}/{room.maxCount}</h5>
                </div>
            ))}
        </div>
    )
}