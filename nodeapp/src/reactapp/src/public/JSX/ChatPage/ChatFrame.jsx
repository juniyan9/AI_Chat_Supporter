import React, { useEffect, useState, useRef } from "react";
import '../../CSS/ChatFrame.css';
import io from 'socket.io-client';
import InfoBar from "./InfoBar";
import MessageContainer from "./MessageContainer";
import TextContainer from "./TextContainer";
import { useNavigate } from "react-router-dom";

export default function ChatFrame({ roomName, nickName, setOwnerNickName}) {
    const [messages, setMessages] = useState([]);
    const [onsearchtext, setonSearchText] = useState('');
    const [roomCount, setRoomCount] = useState(0); // roomCount 상태 추가
    const [isPrivate, setIsPrivate] = useState(false); // 방의 비공개 여부 추가
    const [maxCount, setMaxCount] = useState(10); // 최대 인원수 추가
    const [updatedRoomName, setUpdatedRoomName] = useState(roomName); // 방 이름 상태
    const [password, setPassword] = useState(''); // 비밀번호 상태
    const socket = useRef(null);
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동
    

    useEffect(() => {
        
        socket.current = io('http://43.203.141.146:5050');
        

        socket.current.on('connect', () => {
            socket.current.emit('enter_room', nickName, roomName);
            // console.log(nickName, roomName);
        });

        // 서버로부터 사용자 수(roomCount) 업데이트 받기
        socket.current.on('roomCountUpdate', (count) => {
            setRoomCount(count); // roomCount 업데이트
        });

        // 서버에서 방장 정보를 받아오는 이벤트 리스너
        socket.current.on('room_details', ( roomDetails ) => {
            console.log("서버에서 받은 roomDetails", roomDetails);
            console.log("서버에서 받은 roomDetails.room.ownerNickName:", roomDetails.ownerNickname);
            setOwnerNickName(roomDetails.ownerNickname);  // 부모 컴포넌트로 ownerNickname 전달
            setMaxCount(roomDetails.maxCount);

        });

        socket.current.on('roomDeleted', (data) => {
            console.log("서버에게 받은 roomDeleted 정보 :",data);
            if (data.ownerNickname === nickName) {
                // 방장이 나갈 때만 ChatListPage로 이동
                alert(data.message); 
                navigate('/ChatListPage');
            } else {
                // 방장이 아닌 사용자가 나갈 때는 방을 나가는 동작만 처리
                console.log('다른 사용자가 나갔습니다.');
            }
        });

        // console.log("chatFrame 방장닉네임 :", ownerNickname)
    
        // 서버에서 업데이트된 방 정보 받아오는 이벤트 리스너
        socket.current.on('room_settings_updated', (updatedSettings) => {
            console.log('Room settings updated :', updatedSettings);
            setUpdatedRoomName(updatedSettings.name); // 변경된 방 이름 업데이트
            setMaxCount(updatedSettings.maxCount);   // 변경된 최대 인원수 업데이트
            setIsPrivate(updatedSettings.isPrivate); //변경된 비공개 여부 업데이트
            setPassword(updatedSettings.password); //변경된 비밀번호 업데이트
        })

        socket.current.on('reply', (reply_message, nickName) => {
            setMessages(prevMessages => [
                ...prevMessages,
                { nickName, text: reply_message },
            ]);
        });

        return () => {
            socket.current.disconnect();
        };
    }, [nickName, roomName, setOwnerNickName, navigate]);


    return (
        <div className="ChatFrame">
            <InfoBar
                roomName={roomName} // 업데이트된 . 방이름 사용
                setonsearchtext={setonSearchText}
                roomCount={roomCount}
                maxCount = {maxCount}      // 업데이트된 최대 인원수 사용
                isPrivate={isPrivate}      // 업데이트된 비공개 여부 사용
                password={password}
            />
            <MessageContainer
                messages={messages}
                onsearchtext={onsearchtext}
            />
            <TextContainer 
                socket={socket} 
                setMessages={setMessages} 
                nickName={nickName} 
                roomName={roomName || updatedRoomName} // 변경된 방 이름 전달  
            />
        </div>
    );
}
