import React, { useEffect, useState, useRef } from "react";
import '../../CSS/ChatFrame.css';
import io from 'socket.io-client';
import InfoBar from "./InfoBar";
import MessageContainer from "./MessageContainer";
import TextContainer from "./TextContainer";
import RoomSettingsModal from './RoomSettingsModal';


export default function ChatFrame({setIsSocketConnected,location, UserName, room, socket, roomCount, setRoomCount, roomName, setRoomName, password, setPassword, isPrivate, setIsPrivate, maxCount, setMaxCount}) {
    const [onsearchtext, setonSearchText] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [ownerNickname, setOwnerNickName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [messages, setMessages] = useState([]);
    
    

    const roomId = location.state?.roomId; // roomId를 사용
    
    console.log("ChatFrame,useeffect");
    
    useEffect(() => {
        if(room && !socket.current){
            if(room.count < room.maxCount){
                socket.current = io('http://localhost:5050');
                socket.current.on('connect', () => {
                socket.current.emit('enter_room', UserName, room.name);
                setIsSocketConnected(true);
            })
            }else{
                alert('방이 꽉찼습니다');
                return;
            }
            
            console.log(socket.current);
            
            socket.current.on('roomCountUpdate', (count) => {
                setRoomCount(count); // roomCount 업데이트
            });
            

            // 서버에서 방장 정보를 받아오는 이벤트 리스너
            socket.current.on('room_details', ( roomDetails ) => {
                setOwnerNickName(roomDetails.ownerNickname);  // 부모 컴포넌트로 ownerNickname 전달
                setMaxCount(roomDetails.maxCount);
            });


            socket.current.on('roomDeleted', (data) => {
                console.log("서버에게 받은 roomDeleted 정보 :",data);
                if (data) {
                    alert("방장이 방을 삭제하였습니다.");
                }
            })
            

            // 서버에서 업데이트된 방 정보 받아오는 이벤트 리스너
            
            
            socket.current.on('room_updated', (updatedSettings) => {
                console.log('Room settings updated :', updatedSettings);
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




        }
        // 소켓 연결 해제
        return ()=>{
            if(socket.current){
                socket.current.close();
                socket.current =null;
            }
        };
    }, [UserName, roomId, room]);

    useEffect(() => {
        // 방장 여부 설정
        setIsOwner(UserName === ownerNickname);
    }, [UserName, ownerNickname]);


    // 방 정보 업데이트 핸들러
    const handleUpdateRoom = (updatedRoomDetails) => {
        setRoomName(updatedRoomDetails.name);
        setMaxCount(updatedRoomDetails.maxCount);
        setPassword(updatedRoomDetails.password);
        setIsPrivate(updatedRoomDetails.isPrivate);
    };
    const handleCloseModal = () => setShowModal(false);

    


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
                nickName={UserName} 
                roomName={roomName} // 변경된 방 이름 전달
                IsOwner={isOwner}
            />
            {isOwner && (
                <RoomSettingsModal
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    onUpdate={handleUpdateRoom}
                    setShowModal={setShowModal}
                    socket={socket}
                    roomDetails={{ 
                        name: roomName,
                        maxCount: maxCount,
                        password: password,
                        isPrivate: isPrivate,
                        ownerNickname: ownerNickname,
                        nickName: UserName
                    }}
                    
                />
        
            )}
        </div>
    );
}
