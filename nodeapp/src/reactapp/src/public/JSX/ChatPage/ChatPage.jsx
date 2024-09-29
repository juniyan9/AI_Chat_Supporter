import React, { useEffect, useState, useRef } from 'react';
import '../../CSS/ChatPage.css';
import ChatFrame from './ChatFrame';
import LogFrame from './LogFrame';
import { useLocation, useNavigate } from 'react-router-dom';
import RoomSettingsModal from './RoomSettingsModal';
import io from 'socket.io-client'; // 소켓 연결 추가

export default function ChatPage() {
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [ownerNickname, setOwnerNickName] = useState(''); // 방장 이름을 상태로 관리
    const [isOwner, setIsOwner] = useState(false); // 방장 여부 상태 추가
    const [roomName, setRoomName] = useState(location.state?.roomName || '기본 방 이름');
    const [maxCount, setMaxCount] = useState(10); // 초기 최대 인원 설정
    const [password, setPassword] = useState(''); // 초기 비밀번호 설정
    const [isPrivate, setIsPrivate] = useState(false); // 초기 비공개 여부 설정
    const [messages, setMessages] = useState([]); // 메시지 상태
    const [roomCount, setRoomCount] = useState(0); // 사용자 수 상태
    const [updatedRoomName, setUpdatedRoomName] = useState(roomName); // 방 이름 상태
    // const [roomName, setRoomName] = useState(location.state?.roomName || '기본 방 이름');

    const [timeoutId, setTimeoutId] = useState(location.state?.timeoutId);
    const navigate = useNavigate();

    let socket = useRef(null); // 소켓 연결을 위한 ref
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    const roomId = location.state?.roomId; // roomId를 사용
    const currentUserName = location.state?.nickName;
    // const timeoutId = location.state?.timeoutId;

    // const [timeoutId, setTimeoutId] = useState(location.state?.timeoutId); // 사용자 수 상태 = location.state?.timeoutId;
console.log('socket:::::::::::::::::::::::::',socket)
    useEffect(() => {
        if(!socket.current){
            socket.current = io('http://43.203.141.146:5050');

            socket.current.on('connect', () => {
                setIsSocketConnected(true);
                socket.current.emit('enter_room', currentUserName, roomName);
                // console.log("timeoutId 상태:", timeoutId);
                if (timeoutId) {
                    // console.log("clearTimeout 전 timeoutId:", timeoutId)
                    clearTimeout(timeoutId); // 타이머 해제
                    console.log("소켓에서 timeoutId 지웠습니다.")
                    setTimeoutId(0) 
                    console.log("소켓에서 timeoutId 만료 후 timeoutId:", timeoutId)
                }
                // if (timeoutId) {
                //     console.log("clearTimeout 전 timeoutId:", timeoutId);
                //     clearTimeout(timeoutId);
                //     console.log("소켓에서 timeoutId 지웠습니다.");
                //     setTimeoutId(null); // null로 초기화
                // }
            })
            
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
                if (data) {
                    alert("방장이 방을 삭제하였습니다.");
                    // 삭제 요청 후 바로 ChatListPage로 이동
                    navigate('/ChatListPage', {
                        state: {
                            nickName: currentUserName,  // 삭제 후 닉네임 정보 전달
                        },
                    });
                }
            });
            
            // socket.current.on('timeout_cancelled', ({ timeoutId }) => {
            //     console.log("타임아웃 해제됨");
            //     if (timeoutId) {
            //         clearTimeout(timeoutId); // 타임아웃 해제
            //         setTimeoutId(null); // timeoutId 상태 초기화
            //     }
            // });

            // console.log("chatFrame 방장닉네임 :", ownerNickname)
            // 서버에서 업데이트된 방 정보 받아오는 이벤트 리스너
            socket.current.on('room_updated', (updatedSettings) => {
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
        };
        // 소켓 연결 해제
        return () => {
            socket.current.close();
        };
    }, [currentUserName, roomId]);
// }, [currentUserName, roomId, timeoutId]);


    useEffect(() => {
        // 방장 여부 설정
        setIsOwner(currentUserName === ownerNickname);
    }, [currentUserName, ownerNickname]);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    // 방 정보 업데이트 핸들러
    const handleUpdateRoom = (updatedRoomDetails) => {
        setRoomName(updatedRoomDetails.name);
        setMaxCount(updatedRoomDetails.maxCount);
        setPassword(updatedRoomDetails.password);
        setIsPrivate(updatedRoomDetails.isPrivate);
    };
 
    return (
        <div className="chatPage">
            
            <div className="chatFrameContainer">
                {isOwner && (
                    <button onClick={handleOpenModal} className="settingsButton">
                        방 설정
                    </button>
                )}
                {isSocketConnected ? (
                <ChatFrame 
                    roomName={roomName} 
                    nickName={currentUserName} 
                    maxCount={maxCount}
                    password={password}
                    isPrivate={isPrivate}
                    messages={messages} // 메시지 전달
                    roomCount={roomCount} // 방의 사용자 수 전달
                    setMessages={setMessages} // setMessages 전달
                    socket={socket}
                    setOwnerNickName={setOwnerNickName}
                />
                ) : (<p>Connecting to WebSocket...</p>)}
            </div>
            <LogFrame />
            
           {isOwner && (
                <RoomSettingsModal
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    roomDetails={{ 
                        name: roomName,
                        maxCount: maxCount,
                        password: password,
                        isPrivate: isPrivate,
                        ownerNickname: ownerNickname,
                        nickName: currentUserName
                    }}
                    onUpdate={handleUpdateRoom}
                    socket={socket}
                    isSocketConnected={isSocketConnected}
                />
        
            )}
            
        </div>
    );
}
