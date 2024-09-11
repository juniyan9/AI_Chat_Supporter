import React, { useEffect, useState, useRef } from "react";
import '../../CSS/ChatFrame.css';
import io from 'socket.io-client';
import InfoBar from "./InfoBar";
import MessageContainer from "./MessageContainer";
import TextContainer from "./TextContainer";

export default function ChatFrame({ roomName, nickName, roomId,maxCount, password, isPrivate, onOwnerNicknameUpdate }) {
    const [messages, setMessages] = useState([]);
    const [onsearchtext, setonSearchText] = useState('');
    const [roomCount, setRoomCount] = useState(0);
    const socket = useRef(null); // 소켓을 useRef로 유지

    useEffect(() => {
            socket.current = io('http://43.203.141.146:5050');

            // 서버에 방 입장 요청
            socket.current.on('connect', () => {
                socket.current.emit('enter_room', nickName, roomName, roomId);
                console.log(nickName, roomName, roomId);
            });

            // 서버로부터 방 정보를 받는 이벤트 처리
            socket.current.on('room_details', (roomDetails) => {
                console.log('받은 room details의 방장이름 :', roomDetails); // 응답 로그 
                if (roomDetails.error) {
                    console.error("room details에 대한 에러:", roomDetails.error);
                    return;
                }

                // 방장 정보 설정 및 부모에게 전달
                const ownerNicknameUpdate = roomDetails; // 방장의 이름만 추출
                onOwnerNicknameUpdate(ownerNicknameUpdate);  // 부모에게 ownerNickname 전달
            });

            // 서버로부터 사용자 수(roomCount) 업데이트 받기
            socket.current.on('roomCountUpdate', (count) => {
                setRoomCount(count); // roomCount 업데이트
            });

            // 서버로부터 메시지(reply) 받기
            socket.current.on('reply', (reply_message, senderNickName) => {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { nickName: senderNickName, text: reply_message },
                ]);
            });
        

        // 컴포넌트 언마운트 시 소켓 연결 해제
        return () => {
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null; // 소켓을 해제하고 null로 초기화
            }
        };
    }, [nickName, roomName, onOwnerNicknameUpdate]); // 빈 배열이 아닌 nickName과 roomName을 의존성으로 설정

    return (
        <div className="ChatFrame">
            <InfoBar
                roomName={roomName}
                setonsearchtext={setonSearchText}
                roomCount={roomCount}
            />
            <MessageContainer
                messages={messages}
                onsearchtext={onsearchtext}
            />
            <TextContainer
                socket={socket}
                setMessages={setMessages}
                nickName={nickName}
                roomName={roomName}
            />
        </div>
    );
}
